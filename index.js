const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let numberOfRequests = 0;

/**
 * Middleware que checa se o ID de um projeto existe
 */
function checkIdInArray(req, res, next) {
  const { id } = req.params;

  idProject = projects.find(p => p.id == id);
  if (!idProject) {
    return res.status(400).json({ error: "ID Not found" });
  }
  return next();
}

/**
 * Middleware que dá log no número de requisições
 */
server.use((req, res, next) => {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
});

/**
 * Projects
 * Rota: localhost:3000/projects/
 * {
 *  "id" : "1",
 *	"title": "Novo Projeto"
 * }
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkIdInArray, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  projects.splice(project, 1);

  return res.send();
});

/**
 * Tasks
 * Rota: localhost:3000/projects/1/tasks
 * {
 *	"title": "Nova tarefa"
 * }
 */
server.post("/projects/:id/tasks", checkIdInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectIndex = projects.find(p => p.id == id);

  projectIndex.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
