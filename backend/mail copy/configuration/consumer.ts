import amqp, { connect } from "amqplib";
import nodemailer from "nodemailer";


export const startSendOtpConsumer = async () => {
    try {
        
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RabbitMQ_Host,
            port: 5672,
            username: process.env.RabbitMQ_Username,
            password: process.env.RabbitMQ_Password,

        })
        const channel = await connection.createChannel();

        const queName = "send-otp";

        await channel.assertQueue(queName, { durable: true });
        console.log("✅ Mail service consumer started, listening for OTP emails");

        channel.consume(queName, async (msg) => {

            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        auth: {
                            user: process.env.MAIL_USERNAME,
                            pass: process.env.MAIL_PASSWORD,
                        }

                    })

                    await transporter.sendMail({
                        from: "Chat App",
                        to,
                        subject,
                        text: body
                    })

                    console.log(`OPT mail sent to ${to}`)
                    channel.ack(msg)
                } catch (error) {
                    console.log("❌ Failed to send OTP! ", error)
                }
            }
        })


    } catch (error) {
        console.log("❌ Failed to start RabbitMQ consumer!")
    }
}