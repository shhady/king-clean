// Create backup scripts
import { exec } from 'child_process';
import { format } from 'date-fns';

const backupMongoDB = () => {
  const date = format(new Date(), 'yyyy-MM-dd');
  const command = `mongodump --uri="${process.env.MONGODB_URI}" --out="./backups/${date}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) console.error(`Backup error: ${error}`);
    else console.log('Backup completed successfully');
  });
}; 