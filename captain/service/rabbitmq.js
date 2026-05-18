import amqp from "amqplib";

let connection=null;
let channel=null;

const connectToMQ = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("Captain Service connected to RabbitMQ");
};

const publishToQueue = async (queueName, msg) => {
  if (!channel) await connectToMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
};

const subscribeToQueue = async (queueName, callback) => {
  if (!channel) await connectToMQ();
  channel.assertQueue(queueName, { durable: true });

  console.log("Subscribing to ride_created queue");
  channel.consume(queueName, async (msg) => {
    try {
      await callback(msg.content.toString());
      channel.ack(msg);
    } catch (error) {
      console.error("Error occurred while processing message:", error);
      channel.nack(msg);
    }
  });
};

export { connectToMQ, publishToQueue, subscribeToQueue };
