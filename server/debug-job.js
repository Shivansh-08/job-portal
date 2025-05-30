import mongoose from 'mongoose';
import 'dotenv/config';

console.log('🔍 Starting Job model debug...');

try {
    // Show connection string (without password)
    const mongoUri = process.env.MONGO_URI; // Changed to MONGO_URI
    console.log('📡 MongoDB URI:', mongoUri?.replace(/:[^:@]*@/, ':***@')); // Hide password
    
    // Connect to database with database name
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(`${mongoUri}/job-portal`); // Added /job-portal
    console.log('✅ MongoDB connected successfully');
    
    // Show which database we're connected to
    console.log('🗄️ Connected to database:', mongoose.connection.db.databaseName);
    console.log('🏠 Connection host:', mongoose.connection.host);
    
    // List all collections in this database
    console.log('📋 Collections in database:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Import Job model
    console.log('📦 Importing Job model...');
    const Job = (await import('./models/job.js')).default;
    console.log('✅ Job model imported:', Job.modelName);
    console.log('📄 Job collection name:', Job.collection.name);

    // Count all documents in jobs collection (without filters)
    console.log('🔢 Total documents in jobs collection:');
    const totalCount = await Job.countDocuments();
    console.log('  - Total jobs:', totalCount);
    
    // Count visible jobs
    const visibleCount = await Job.countDocuments({visible: true});
    console.log('  - Visible jobs:', visibleCount);
    
    // Count invisible jobs
    const invisibleCount = await Job.countDocuments({visible: false});
    console.log('  - Invisible jobs:', invisibleCount);
    
    // Show a sample job (if any exist)
    const sampleJob = await Job.findOne();
    if (sampleJob) {
        console.log('📄 Sample job:');
        console.log('  - ID:', sampleJob._id);
        console.log('  - Title:', sampleJob.title);
        console.log('  - Visible:', sampleJob.visible);
        console.log('  - Company ID:', sampleJob.companyId);
    } else {
        console.log('❌ No jobs found in this database!');
    }

} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📊 Full error:', error);
} finally {
    process.exit(0);
}