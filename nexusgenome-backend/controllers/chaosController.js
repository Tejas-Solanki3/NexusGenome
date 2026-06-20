// @desc    Simulate system chaos events and return operational diagnostics
// @route   POST /api/chaos/simulate
// @access  Public
export const simulateChaos = async (req, res) => {
  const { type } = req.body;
  const timestamp = new Date().toLocaleTimeString();

  if (!type || !['spike', 'outage', 'corrupt', 'reset'].includes(type)) {
    return res.status(400).json({ message: 'Invalid chaos simulation type. Allowed: spike, outage, corrupt, reset' });
  }

  let delayMs = 0;
  let status = 'OPTIMAL';
  let logs = [];

  switch (type) {
    case 'outage':
      status = 'DEGRADED';
      logs = [
        `[${timestamp}] [CHAOS] Disconnecting global lab bridges...`,
        `[${timestamp}] [k8s-ingress] Connection to london-lab-bridge-ssl lost!`,
        `[${timestamp}] [k8s-ingress] Connection to mumbai-hub-bridge-ssl lost!`,
        `[${timestamp}] [DEVOPS] Re-routing traffic payloads to node-tokyo-02`
      ];
      break;

    case 'spike':
      status = 'OPTIMAL';
      logs = [
        `[${timestamp}] [CHAOS] Injecting traffic demand queue spike (+350%)...`,
        `[${timestamp}] [k8s-hpa] CPU utilization reached 88.4% (Threshold: 75%)`,
        `[${timestamp}] [k8s-scheduler] Scaling deployment replica count 12 -> 24`,
        `[${timestamp}] [k8s-scheduler] 12 new worker pods successfully status: RUNNING`
      ];
      break;

    case 'corrupt':
      status = 'DEGRADED';
      delayMs = 1500; // Introduce 1.5s artificial database query latency
      logs = [
        `[${timestamp}] [CHAOS] Injecting write sector corruption on pg-primary-01...`,
        `[${timestamp}] [postgres-primary] Deadlock write conflict on table 'genomic_sequences'`,
        `[${timestamp}] [patroni-manager] Promoting pg_secondary_01 to PRIMARY...`,
        `[${timestamp}] [postgres-cluster] Cluster restored in degraded failover state`
      ];
      break;

    case 'reset':
    default:
      status = 'OPTIMAL';
      logs = [
        `[${timestamp}] [CHAOS] Restoring infrastructure steady state...`,
        `[${timestamp}] [k8s-ingress] Reconnected Mumbai and London nodes.`,
        `[${timestamp}] [postgres-cluster] Primary database sync completed successfully.`,
        `[${timestamp}] [k8s-hpa] Scaling worker pods down from 24 to 12.`
      ];
      break;
  }

  console.log(`\x1b[33m[CHAOS] Simulated event: '${type.toUpperCase()}' (Latency: ${delayMs}ms, Status: ${status})\x1b[0m`);

  // Introduce simulated network latency
  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  res.status(200).json({
    success: true,
    simulationType: type,
    systemStatus: status,
    latencyIntroducedMs: delayMs,
    podCount: type === 'spike' ? 24 : 12,
    simulationLogs: logs
  });
};
