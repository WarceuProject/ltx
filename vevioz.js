/**
 * powered by vevioz
 * Author: lintxid
 */

const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");


class MediaProperty {
    constructor(json) {
        this.#data = json;
        this.#bitrate;
        this.#type;

        const media = Object.keys(this.#data || {});

        if (!media.length) {
            throw Error("Get " + media.length + " media results");
        }
    }
    #data
    #bitrate
    #type
    quality(bitrate) {
        bitrate = bitrate.replace(/\D+/g, "") || null;

        if (!this.#data[bitrate]) {
            throw TypeError("Unavailable bitrate: " + bitrate);
        }

        this.#bitrate = bitrate;

        return this;
    }
    format(type) {
        const types = new Set(Object.values(this.#data).flatMap(e => e.map(e => e.type)));

        if (!types.has(type)) {
            throw TypeError("Unavailable format: " + (type || null));
        }

        this.#type = type;

        return this;
    }
    getInfo() {
        const data = (this.#data[this.#bitrate] || []).find(e => e?.type === this.#type);
        
        if (!data) {
            if (!this.#bitrate) {
                throw TypeError("Bitrate not set");
            }
            if (!this.#type) {
                throw TypeError("Format not set");
            }

            return null;
        }

        return data;
    }
    all() {
        return this.#data;
    }
}
class VeviozAPI {
    constructor(yturl) {
        this.yturl = yturl || null;
        this.#originurl = "https://api.vevioz.com/api/button";
        this.vidID = this.#parseYoutubeId(this.yturl);

        if (!this.vidID) {
            throw Error("Invalid youtube url: " + this.yturl);
        }
    }
    #originurl
    #parseYoutubeId(url) {
    	//const regexp = new RegExp('(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})', 'i');
    	const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;
    	const [, ytId] = (url || "").match(ytIdRegex) || [];
    	
    	return ytId;
	}
    async #getInfo(ftype) {
        let res;

        switch (ftype) {
            case "audios":
            case "mp3":
                ftype = "mp3";
                res = await axios(`${this.#originurl}/${ftype}/${this.vidID}`).catch(e => e);
                break;
            case "videos":
            case "mp4":
                ftype = "videos";
                res = await axios(`${this.#originurl}/${ftype}/${this.vidID}`).catch(e => e);
                break;
            default:
                throw TypeError("Invalid ftype: " + ftype);
                break;
        }

        if (!res.data || res instanceof Error) {
            throw Error("Failed getting info: " + res.message);
        }

        return {
            json() {
                return res.data || null;
            },
            cookie() {
                return (res.headers?.["set-cookie"] || []).join("; ") || null;
            }
        }
    }
    async #factoryJsonResult(ftype) {
        const data = (await this.#getInfo(ftype)).json();
        const { window } = new JSDOM(data);
        const { document } = window;
        const results = [].slice.call(document.querySelectorAll("div a"));

        if (!results || !results.length) {
            throw Error("Something error");
        }

        const mediaList = results.reduce((obj, el, i, arr) => {
            const outerEl = [].slice.call(el.children);
            const [ftype, fquality, ,fsize] = outerEl;
            const dlink = el.getAttribute("href");
            const type = ftype.textContent.toLowerCase();
            const qualities = new Set(arr.map(outerEl => [].slice.call(outerEl.children).map(innerEl => innerEl.textContent)[1].trim()).map(s => s.replace(/\D+/g, "")));
            const data = {
                fquality: fquality.textContent.trim(),
                fsize: fsize.textContent,
                dlink,
                type
            }
        
            for (const quality of qualities) {
                if (!obj[quality]) {
                    obj[quality] = [];
                }
                const quality_ = data.fquality.replace(/\D+/g, "");
        
                if (quality === quality_) {
                    obj[quality].push(data);
                }
            }
            
            return obj;
        }, {});

        return mediaList;
    }
    async getAudios() {
        const results = await this.#factoryJsonResult("audios");

        return new MediaProperty(results);
    }
    async getVideos() {
        const results = await this.#factoryJsonResult("videos");

        return new MediaProperty(results);
    }
}

module.exports = VeviozAPI;

const vevioz = new VeviozAPI("https://youtu.be/oDA6DMGq494");

function test() {
    vevioz.getAudios()
        .then(results => {
            console.log(results.quality("128").format("mp3").getInfo());
        });
    vevioz.getVideos()
        .then(results => {
            console.log(results.quality("144").format("mp4").getInfo());
        });
}
