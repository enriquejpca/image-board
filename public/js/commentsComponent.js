const commentsComponent = {
    data() {
        //console.log("It is working");
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["commentImageId"],
    mounted() {
        //console.log("commentComponents just mounted");
        console.log(
            "commentsComponent this.commentImageId: ",
            this.commentImageId
        );
        fetch(`/comments/${this.commentImageId}`)
            .then((res) => res.json())
            .then((res) => {
                this.comments = res;
            });
    },

    methods: {
        postComment: function () {
            console.log("Submit button is working");
            fetch("/comment", {
                method: "POST",
                body: JSON.stringify({
                    image_id: this.commentImageId,
                    username: this.username,
                    comment: this.comment,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then(({ rows }) => {
                    //this.getComments();
                    console.log("rows[0].username", rows[0].username);
                    console.log("rows[0].comment", rows[0].comment);
                    // this.username.push(rows[0].username);
                    // this.comments.push(rows[0].comment);
                    this.comments.push(rows[0]);
                });
        },
    },

    template: `<div class="inputsforcomments">
                    <input v-model="username" type="text" name="username" placeholder="username">
                    <input v-model="comment" type="text" name="comment" placeholder="comment">
                    <button @click.prevent="postComment">Submit</button>
             </div>
            <div class="commentsbox">
                <div v-for="comment in comments">
                    <p>{{comment.username}} {{comment.comment}}</p>
                </div>
              
            </div>`,
};

export default commentsComponent;
