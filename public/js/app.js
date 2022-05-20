//App.js will contain ALL of our Vue code.

import * as Vue from "./vue.js";
import firstComponent from "./firstComponent.js";

Vue.createApp({
    data() {
        return {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
            selectId: null,
        };
    }, //data ends here

    mounted() {
        window.addEventListener("popstate", () => {
            console.log("back/forward button clckkd");
            console.log("updated to ", location.pathname);
            if (location.pathname.slice(1).length === 0) {
                this.selectId = null;
            } else {
                this.selectId = location.pathname.slice(1);
            }
        });

        // window.addEventListener("popstate", () => {
        //     // console.log("the user just used the forward or backward button!");
        //     // console.log("url updated to:", location.pathname.slice(8));
        //     this.selectedImage = location.pathname.slice(1);
        // });
        //console.log("My vue app has mounted");
        //console.log("this: ", this);

        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                //console.log("data from images", data);
                this.images = data;
                this.selectId = location.pathname.slice(1);
            });
    },

    components: {
        "first-component": firstComponent,
    },

    methods: {
        clickHandler: function () {
            const fd = new FormData();
            fd.append("username", this.username);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("file", this.file);

            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log("response: ", response);
                    this.images.push();
                })
                .catch((err) => {
                    console.log("error submitting form fields: ", err);
                });
        },

        moreButton: function () {
            //console.log("More Button has been clicked");

            let lastId = null;
            for (let i = 0; i < this.images.length; i++) {
                this.images[i] < lastId;
                lastId = this.images[i].id;
            }
            console.log("This.lastId: ", lastId);
            console.log("This.images: ", this.images);
            fetch(`/images/${lastId}`)
                .then((res) => res.json())
                .then((res) => {
                    console.log("response from moreimages: ", res);
                    this.images.push(res[0]);
                    this.images.push(res[1]);
                    this.images.push(res[2]);

                    let image = 0;
                    for (image of res) {
                        console.log("image: ", image);
                    }
                    console.log("image.id: ", image.id);
                    console.log("image.lowestId: ", image.lowestId);
                    if (image.id === image.lowestId) {
                        // document.getElementsByClassName(
                        //     "morebutton"
                        // ).style.visibility = "hidden";
                        this.visible = false;
                        //this.moreButton = null;
                        //this.moreButton.hide();
                    }
                });
            // let image = 0;
            // for (this.images) {
            //     console.log("image: ", this.images);
            // document.getElementsByClassName(
            //     "morebutton"
            // ).style.visibility = "hidden";
            //let image = null;
            // for (length of this.images) {
            //     //let lastId = null;
            //     console.log("lastId, ", lastId);
            //     //console.log("this.images.id: ", this.images.id);

            //     if (this.images.id === this.images.lowestId) {
            //         document.getElementById("morebutton").style.visibility =
            //             "hidden";
            //     }
            // }
        },

        fileSelectHandler: function (e) {
            this.file = e.target.files[0];
        },
        selectImages: function (imageId) {
            //console.log("User click in image");
            //console.log("ImagesId: ", imageId);
            this.selectId = imageId;
        },
        hideComponent: function () {
            //console.log("app.js: the firstComponent want me to do sth");
            //To hide the component we simply set the value of the selected photo to somethoing falsy like null.
            this.selectId = null;
            //this.moreButton = null;
        },
    },
}).mount("#main");
