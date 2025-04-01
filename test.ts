import {getLlama} from "node-llama-cpp";

const llama = await getLlama({gpu: true});
console.log(llama.llamaCppRelease)
