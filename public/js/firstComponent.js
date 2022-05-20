import commentsComponent from "./commentsComponent.js";

const firstComponent = {
    data() {
        return {
            url: "",
            username: "",
            title: "",
            description: "",
            created_at: "",
        };
    },
    props: ["imageId"],
    mounted() {
        //console.log("First component just mounted");
        console.log("First component this.imageId: ", this.imageId);

        fetch(`/image/${this.imageId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data[0]);

                this.url = data[0].url;
                this.username = data[0].username;
                this.title = data[0].title;
                this.description = data[0].description;
                if (this.imageId) {
                    history.pushState({}, "", this.imageId);
                }
            });
    },
    components: {
        commentsComponent: commentsComponent,
    },

    methods: {
        parentDoSth() {
            //console.log("parent should do sth");
            // to inform parent to do sth, we EMIT a keyword
            this.$emit("close");
        },
    },
    template: `<div class="modalbox">
                    <div class="modalcontent">
                        <button type="button" class="btn-close" @click="parentDoSth">X</button>
                        <img :src="this.url">
                        <p>Title: {{this.title}}</p>
                        <p>User: {{this.username}}</p>
                        <p> Description: {{this.description}}</p>
                        <commentsComponent v-bind:comment-image-id="imageId"></commentsComponent>
                    </div>
                    
                        
                    
                
                   
                </div>`,
};

export default firstComponent;
