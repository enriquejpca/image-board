const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

exports.getImages = () => {
    return db.query(`
    SELECT * FROM images
    ORDER BY id DESC
    LIMIT 3`);
};

exports.uploadedPhoto = (title, description, username, url) => {
    return db.query(
        `INSERT INTO IMAGES (title, description, username, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [title, description, username, url]
    );
};

exports.getImageById = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3;`,
        [lastId]
    );
};

exports.getComments = (imageId) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [imageId]);
};

exports.addComment = (image_id, username, comment) => {
    return db.query(
        `INSERT INTO comments (image_id, username, comment)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [image_id, username, comment]
    );
};
