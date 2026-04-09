import amqp from "amqplib";

let channel: amqp.Channel;


export const connectRabbitMQ = async () => {
    try {
        const connection  = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RabbitMQ_Host,
            port: 5672,
            username: process.env.RabbitMQ_Username,
            password: process.env.RabbitMQ_Password,

        })
        channel = await connection.createChannel();
        console.log("✅ Cinnected to rabbitMQ!")
    } catch (error) {
        console.error(`Failed to connect to RabbitMQ!`, error);
        
    }
}

export const publishToQueue = async (queName: string, message: any) => {
    if(!channel){
        console.log(`RabbitMQ channer is not initialized!`)
        return 
    }
    await channel.assertQueue(queName, { durable: true });
    channel.sendToQueue(queName, Buffer.from(JSON.stringify(message)), {
        persistent: true
    })
}