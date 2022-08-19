import {
    MessageSchema,
    IMessage
} from "../schema/MessageSchema";


let cmdMsg: IMessage = {
    "meta": {
        "requestId": "1122-2212323132-2113"
    },
    "data": {
        "command":"get-state",
        "params": [{
            "name": "s1.ena",
            "value": "1"
        },{
            "name": "s2.ena",
            "value": "0"
        }]
    }
}

try {
    MessageSchema.check(cmdMsg);
} catch(e) {
    console.log(e.stack);
    for (let i in e) {
        console.info("KEYS:", i, e[i]);
    }

}