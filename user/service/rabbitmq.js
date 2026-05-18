import amqp from "amqplib";

let connection;
let channel;

const connectToMQ = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("User Service connected to RabbitMQ");
};

const publishToQueue = async (queueName, msg) => {
  if (!channel) await connectToMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
};

const subscribeToQueue = async (queueName, callback) => {
  if (!channel) await connectToMQ();
  channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    callback(msg.content.toString());
    channel.ack(msg);
  });
};

export { connectToMQ, publishToQueue, subscribeToQueue };
