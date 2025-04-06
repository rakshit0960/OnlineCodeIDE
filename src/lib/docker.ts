import Docker, { DockerOptions } from 'dockerode';

// Determine Docker options based on the operating system
const dockerOptions: DockerOptions = process.platform === 'win32'
  ? { socketPath: '//./pipe/docker_engine' }
  : { socketPath: '/var/run/docker.sock' };

// Create and export a singleton Docker instance
const docker = new Docker(dockerOptions);
export default docker;
