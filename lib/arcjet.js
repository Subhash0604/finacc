import arcjet, { tokenBucket }  from "arcjet"


const aj  = arcjet({
    key:process.env.ARCJET_KEY,
    log: console.log,
    client: "finacc-app",
    characteristics: ["userId"],
    rules:[
        tokenBucket({
            mode: "LIVE",
            refillRate: 10,
            interval: 3600,
            capacity: 10,
        })
    ]
})

export default aj; 