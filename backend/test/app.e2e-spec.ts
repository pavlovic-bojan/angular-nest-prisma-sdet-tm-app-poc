import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

describe("Task Manager API (e2e)", () => {
  let app: INestApplication<App>;
  let projectId: string;
  let userId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors();
    const config = new DocumentBuilder()
      .setTitle("Task Manager API")
      .setVersion("1.0")
      .build();
    SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Health & Swagger", () => {
    it("GET / returns Hello World", () => {
      return request(app.getHttpServer()).get("/").expect(200).expect("Hello World!");
    });

    it("GET /api-json - Swagger OpenAPI doc", () => {
      return request(app.getHttpServer())
        .get("/api-json")
        .expect(200)
        .expect((res) => expect(res.body.info?.title).toBe("Task Manager API"));
    });
  });

  describe("Auth", () => {
    it("POST /auth/login - invalid credentials returns 401", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: "wrong@test.com", password: "wrongpass" })
        .expect(401);
    });

    it("POST /auth/login - valid credentials returns user", async () => {
      const res = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: "demo@example.com", password: "password123" });
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty("email", "demo@example.com");
      expect(res.body).not.toHaveProperty("password");
    });
  });

  describe("Users", () => {
    it("GET /users returns array", async () => {
      const res = await request(app.getHttpServer()).get("/users").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) userId = res.body[0].id;
    });

    it("POST /users creates user", async () => {
      const email = `e2e-${Date.now()}@test.com`;
      const res = await request(app.getHttpServer())
        .post("/users")
        .send({ name: "E2E User", email, role: "developer" })
        .expect(201);
      expect(res.body).toHaveProperty("email", email);
      userId = res.body.id;
    });

    it("GET /users/:id returns user", () => {
      return request(app.getHttpServer()).get(`/users/${userId}`).expect(200);
    });

    it("PUT /users/:id updates user", async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ name: "E2E Updated" })
        .expect(200);
      expect(res.body.name).toBe("E2E Updated");
    });

    it("GET /users/invalid-id returns 404", () => {
      return request(app.getHttpServer()).get("/users/invalid-id").expect(404);
    });
  });

  describe("Projects", () => {
    it("GET /projects returns array", async () => {
      const res = await request(app.getHttpServer()).get("/projects").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) projectId = res.body[0].id;
    });

    it("POST /projects creates project", async () => {
      const res = await request(app.getHttpServer())
        .post("/projects")
        .send({ name: "E2E Project", description: "Test" })
        .expect(201);
      expect(res.body.name).toBe("E2E Project");
      projectId = res.body.id;
    });

    it("GET /projects/:id returns project", () => {
      return request(app.getHttpServer()).get(`/projects/${projectId}`).expect(200);
    });

    it("PUT /projects/:id updates project", async () => {
      const res = await request(app.getHttpServer())
        .put(`/projects/${projectId}`)
        .send({ name: "E2E Updated" })
        .expect(200);
      expect(res.body.name).toBe("E2E Updated");
    });

    it("GET /projects/invalid-id returns 404", () => {
      return request(app.getHttpServer()).get("/projects/invalid-id").expect(404);
    });
  });

  describe("Tasks", () => {
    beforeAll(async () => {
      const usersRes = await request(app.getHttpServer()).get("/users");
      if (usersRes.body.length > 0) userId = usersRes.body[0].id;
      const projectsRes = await request(app.getHttpServer()).get("/projects");
      if (projectsRes.body.length > 0) projectId = projectsRes.body[0].id;
    });

    it("GET /tasks returns array", async () => {
      const res = await request(app.getHttpServer()).get("/tasks").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /tasks creates task", async () => {
      const res = await request(app.getHttpServer())
        .post("/tasks")
        .send({
          title: "E2E Task",
          description: "Test",
          projectId,
          status: "todo",
          priority: "medium",
        })
        .expect(201);
      expect(res.body.title).toBe("E2E Task");
      taskId = res.body.id;
    });

    it("GET /tasks/:id returns task", () => {
      return request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(200);
    });

    it("PUT /tasks/:id updates task", async () => {
      const res = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send({ title: "E2E Updated" })
        .expect(200);
      expect(res.body.title).toBe("E2E Updated");
    });

    it("DELETE /tasks/:id removes task", () => {
      return request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(200);
    });

    it("GET /tasks/invalid-id returns 404", () => {
      return request(app.getHttpServer()).get("/tasks/invalid-id").expect(404);
    });
  });
});
