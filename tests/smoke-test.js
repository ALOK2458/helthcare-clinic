const http = require("http");
const {
    spawn
} = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const port = 3456;
const appointmentsFile = path.join(rootDir, "data", "appointments.json");
const originalAppointments = fs.existsSync(appointmentsFile) ?
    fs.readFileSync(appointmentsFile, "utf8") :
    null;

function request(pathname, method = "GET", payload) {
    return new Promise((resolve, reject) => {
        const body = payload ? JSON.stringify(payload) : null;
        const req = http.request({
            hostname: "127.0.0.1",
            port,
            path: pathname,
            method,
            headers: body ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(body)
            } : {}
        }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => resolve({
                statusCode: res.statusCode,
                body: data
            }));
        });

        req.on("error", reject);
        if (body) req.write(body);
        req.end();
    });
}

async function waitForServer() {
    for (let i = 0; i < 50; i += 1) {
        try {
            const response = await request("/api/health");
            if (response.statusCode === 200) return;
        } catch (error) {
            // Server is still starting.
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    throw new Error("Server did not become healthy in time");
}

async function main() {
    const server = spawn(process.execPath, ["server.js"], {
        cwd: rootDir,
        env: {
            ...process.env,
            PORT: String(port)
        },
        stdio: ["ignore", "pipe", "pipe"]
    });

    try {
        const logs = [];
        server.stdout.on("data", (chunk) => logs.push(chunk.toString()));
        server.stderr.on("data", (chunk) => logs.push(chunk.toString()));

        await waitForServer();

        const health = await request("/api/health");
        if (health.statusCode !== 200) {
            throw new Error(`Health check failed: ${health.statusCode}`);
        }

        const page = await request("/");
        if (page.statusCode !== 200) {
            throw new Error(`Homepage request failed: ${page.statusCode}`);
        }
        if (!page.body.includes("Diet") && !page.body.includes("diet.html")) {
            throw new Error("Homepage is missing the diet page link");
        }

        const dietPage = await request("/diet.html");
        if (dietPage.statusCode !== 200) {
            throw new Error(`Diet page request failed: ${dietPage.statusCode}`);
        }
        if (!dietPage.body.includes("Diet Chart") && !dietPage.body.includes("Disease-Based Diet")) {
            throw new Error("Diet page is missing its main content");
        }

        const appointmentPayload = {
            name: "Test User",
            phone: "1234567890",
            doctor: "Dr. Smith",
            date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            time: "10:30",
            consultationType: "Follow-up",
            reason: "Smoke test"
        };

        const created = await request("/api/appointments", "POST", appointmentPayload);
        if (created.statusCode !== 201) {
            throw new Error(`Appointment creation failed: ${created.statusCode} ${created.body}`);
        }

        const parsed = JSON.parse(created.body);
        if (!parsed.appointment || !parsed.appointment.id) {
            throw new Error("Appointment response was missing a generated ID");
        }

        const appointments = await request("/api/appointments");
        if (appointments.statusCode !== 200) {
            throw new Error(`Appointments fetch failed: ${appointments.statusCode}`);
        }

        const collection = JSON.parse(appointments.body);
        if (!Array.isArray(collection.appointments)) {
            throw new Error("Appointments endpoint did not return an array");
        }

        console.log("Smoke test passed");
    } finally {
        server.kill("SIGTERM");
        const exit = await new Promise((resolve) => {
            server.on("exit", (code, signal) => resolve({
                code,
                signal
            }));
        });
        if (exit.signal) {
            server.kill("SIGKILL");
        }

        if (originalAppointments === null) {
            if (fs.existsSync(appointmentsFile)) {
                fs.unlinkSync(appointmentsFile);
            }
        } else {
            fs.writeFileSync(appointmentsFile, originalAppointments);
        }
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});