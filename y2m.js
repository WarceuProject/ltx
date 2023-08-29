const { default: axios } = require("axios");

const page = axios({
    url: "https://www.y2mate.com/mates/analyzeV2/ajax",
    method: "POST",
    data: {
        k_query: "https://youtu.be/WdlptghSKTc",
        k_page: "home",
        hl: "id",
        q_auto: 1
    },
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
});

page.then(async res => {
	console.log(res);
    const data = res.data; //JSON.stringify(res.data, null, 4);
    const vid = data.vid;
    const k = data.links["mp3"]["mp3128"].k;
    const convert = Object.assign((await axios({
        url: "https://www.y2mate.com/mates/convertV2/index",
        method: "POST",
        data: {
            vid,
            k
        },
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })).data, {
        metadata: data.links["mp3"]["mp3128"]
    });
    
    console.log(convert);
});

page.catch(console.error);
