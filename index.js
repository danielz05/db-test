import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";


function countWeeksSince(startDate) {
    const currentDate = new Date();
    const timeDifference = currentDate - startDate;
    const weeksDifference = Math.round(timeDifference / (7 * 24 * 60 * 60 * 1000));
    return weeksDifference;
}


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const weeksSince = countWeeksSince(new Date('2023-12-11'));
const port = 3000;
const db = new sqlite3.Database('todo.db');
let tasks = '';

app.post("/save", (req, res) =>{
    let task_date = req.body.task_date;
    let task_description = req.body.task_description;
    db.run(`UPDATE saved_todos SET tasks = COALESCE(tasks, '') || '${task_description},' WHERE day_date = '${task_date}';`);
    res.redirect("/");
});


app.post("/check", (req, res) => {
    db.get(`SELECT tasks FROM saved_todos WHERE day_date = '${req.body.other_date}'`, (error, row) => {
        tasks = row.tasks.split(',');
    });
    res.redirect("/");
});


app.post('/update', (req, res) => {
    db.run(`UPDATE weekly_done SET done_tasks = COALESCE(done_tasks, '') || '${req.body.task},' WHERE week_id = ${weeksSince}`);
});


app.get("/", (req, res) => {
    res.render("index.ejs", {the_tasks : tasks});
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
