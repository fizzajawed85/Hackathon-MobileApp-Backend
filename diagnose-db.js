const mongoose = require('mongoose');
const dns = require('dns');
const net = require('net');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function diagnose() {
    console.log('--- DB DIAGNOSTIC START ---');
    console.log('1. Checking Environment Variable...');
    if (!uri) {
        console.error('❌ MONGO_URI is not defined in .env');
        process.exit(1);
    }
    console.log('✅ MONGO_URI found');

    const host = uri.split('@')[1]?.split('/')[0]?.split('?')[0];
    console.log(`2. Testing DNS resolution for host: ${host}...`);

    dns.lookup(host, (err, address) => {
        if (err) {
            console.error('❌ DNS Lookup Failed. This usually means your local network is blocking the connection or the host is invalid.', err.message);
        } else {
            console.log(`✅ DNS Lookup Successful: ${address}`);
        }
    });

    console.log('3. Testing TCP Connection to Port 27017...');
    const shardHost = 'cluster0-shard-00-00.nhcgfb7.mongodb.net';
    const socket = new net.Socket();
    socket.setTimeout(3000);
    socket.connect(27017, shardHost, () => {
        console.log('✅ TCP Connection to Port 27017 Successful!');
        socket.destroy();
    }).on('error', (err) => {
        console.error('❌ TCP Connection Failed. Port 27017 is likely blocked by your ISP/Firewall.', err.message);
        socket.destroy();
    }).on('timeout', () => {
        console.error('❌ TCP Connection Timed Out. Port 27017 is likely blocked.');
        socket.destroy();
    });

    // Wait bit for TCP check
    await new Promise(r => setTimeout(r, 4000));

    console.log('4. Attempting Mongoose Connection (5s timeout)...');
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed Error Details:');
        console.error('   Name:', err.name);
        console.error('   Message:', err.message);

        if (err.message.includes('Authentication failed') || err.name.includes('MongoServerError')) {
            console.log('\n--- POTENTIAL CAUSE ---');
            console.log('👉 AUTHENTICATION FAILED: The password for "fizzajawed012_db_user" is likely incorrect.');
            console.log('Reset the password in MongoDB Atlas -> Database Access.');
        } else {
            console.log('\n--- POTENTIAL CAUSE ---');
            console.log('👉 NETWORK/DNS ISSUE: Even with 0.0.0.0/0, your network might be blocking MongoDB ports or SRV records.');
            console.log('Try a different internet connection (Mobile Data) if possible.');
        }
        process.exit(1);
    }
}

diagnose();
