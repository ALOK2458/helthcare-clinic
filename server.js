const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const APPOINTMENTS_FILE = path.join(ROOT, "data", "appointments.json");

const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
};

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
    });
    response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk;
            if (body.length > 10000) {
                reject(new Error("Request body is too large"));
                request.destroy();
            }
        });
        request.on("end", () => resolve(body));
        request.on("error", reject);
    });
}

function readAppointments() {
    try {
        return JSON.parse(fs.readFileSync(APPOINTMENTS_FILE, "utf8"));
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

function saveAppointment(appointment) {
    fs.mkdirSync(path.dirname(APPOINTMENTS_FILE), {
        recursive: true
    });
    const appointments = readAppointments();
    appointments.push(appointment);
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
}

function validateAppointment(body) {
    const fields = ["name", "phone", "doctor", "date", "time", "consultationType"];
    const missing = fields.filter((field) => !String(body[field] || "").trim());
    if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return "Choose a valid appointment date";
    if (body.date < new Date().toISOString().slice(0, 10)) return "Appointment date cannot be in the past";
    if (!/^\d{2}:\d{2}$/.test(body.time)) return "Choose a valid appointment time";
    return null;
}

function hasConflictingAppointment(appointment) {
    return readAppointments().some((saved) =>
        saved.doctor === appointment.doctor &&
        saved.date === appointment.date &&
        saved.time === appointment.time &&
        saved.status !== "cancelled"
    );
}

function serveStatic(request, response) {
    const requestedPath = request.url === "/" ? "/index.html" : request.url;
    const filePath = path.normalize(path.join(ROOT, requestedPath));
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404, {
            "Content-Type": "text/plain; charset=utf-8"
        });
        response.end("Not found");
        return;
    }

    response.writeHead(200, {
        "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
        response.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        response.end();
        return;
    }

    if (request.method === "GET" && request.url === "/api/health") {
        sendJson(response, 200, {
            status: "ok",
            service: "medicare-api"
        });
        return;
    }

    if (request.method === "POST" && request.url === "/api/appointments") {
        try {
            const body = JSON.parse(await readRequestBody(request));
            const validationError = validateAppointment(body);
            if (validationError) {
                sendJson(response, 400, {
                    error: validationError
                });
                return;
            }

            const appointment = {
                id: crypto.randomUUID(),
                name: String(body.name).trim(),
                phone: String(body.phone).trim(),
                doctor: String(body.doctor).trim(),
                date: String(body.date).trim(),
                time: String(body.time).trim(),
                consultationType: String(body.consultationType).trim(),
                reason: String(body.reason || "").trim(),
                status: "requested",
                createdAt: new Date().toISOString()
            };
            if (hasConflictingAppointment(appointment)) {
                sendJson(response, 409, {
                    error: "That doctor already has an appointment at this time. Please choose another slot."
                });
                return;
            }
            saveAppointment(appointment);
            sendJson(response, 201, {
                message: "Appointment request received",
                appointment
            });
        } catch (error) {
            sendJson(response, 400, {
                error: "Please send a valid JSON request"
            });
        }
        return;
    }

    if (request.method === "GET" && request.url === "/api/appointments") {
        try {
            sendJson(response, 200, {
                appointments: readAppointments()
            });
        } catch (error) {
            sendJson(response, 500, {
                error: "Appointments could not be loaded"
            });
        }
        return;
    }

    if (request.method === "GET") serveStatic(request, response);
    else sendJson(response, 405, {
        error: "Method not allowed"
    });
});

server.listen(PORT, () => {
    console.log(`MediCare is running at http://localhost:${PORT}`);
});