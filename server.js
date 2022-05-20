const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./upload");
const s3 = require("./s3");
console.log("s3 in server.js: ", s3);

app.use(express.static("./public"));

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages().then((results) => {
        // console.log("results: ", results);
        res.json(results.rows);
    });
});

app.get("/image/:id", (req, res) => {
    console.log(req.params.id);
    db.getImageById(req.params.id).then((results) => {
        //console.log("Results: ", results);
        res.json(results.rows);
    });
});

app.get("/images/:lastId", (req, res) => {
    let lastId = req.params.lastId;
    console.log("lastId000: ", lastId);
    db.getMoreImages(lastId).then((results) => {
        console.log("Results: ", results.rows);
        res.json(results.rows);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("req.body: ", req.body);
    // console.log("req.file: ", req.file);
    // if (req.file) {
    //     res.json({ success: true });
    // } else {
    //     res.json({ success: false });
    // }
    // let fullUrl = newUrl(
    //     `https://s3.amazonaws.com/buckerybucket/${req.file.filename}`
    // );
    // console.log("fullUrl: ", fullUrl);
    if (req.file) {
        //do all the db stuff.
        //send that file back to vue.
        let url = `https://s3.amazonaws.com/buckerybucket/${req.file.filename}`;
        console.log("fullUrl: ", url);
        const { title, description, username } = req.body;
        db.uploadedPhoto(title, description, username, url)
            .then((results) => {
                console.log("results uploaded photo: ", results);
                // let upload = results.rows[0];
                // res.json(upload);
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    } else {
        //handle it.
        res.sendStatus(500);
    }
});

app.get("/comments/:imageId", (req, res) => {
    db.getComments(req.params.imageId).then(({ rows }) => {
        //console.log("Req.params.imageId: ", req.params.imageId);
        //console.log("rows: ", rows);
        res.json(rows);
    });
});

app.post("/comment", (req, res) => {
    const { image_id, username, comment } = req.body;
    console.log("req.body: ", req.body);
    db.addComment(image_id, username, comment).then((results) => {
        console.log("results add comment: ", results);
        res.json(results);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
