import { HttpStatusCodeGetRandom } from "./HttpStatusCode";

class Cat {

    static randomCatPictureURL(): string {
        const myRandomValue = HttpStatusCodeGetRandom();
        let catURL = "https://http.cat/" + myRandomValue + ".jpg";
        return catURL;
    }

    id: string;
    url: string;

    constructor(id: string, url: string) {
        this.id = id
        this.url = url
    }
}

export default Cat;
