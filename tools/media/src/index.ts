import { ZERO_COST_LIMITS } from '@movie/shared';

export interface StorageBudgetAssessment {
  currentSizeBytes: number;
  incomingSizeBytes: number;
  projectedTotalBytes: number;
  allowed: boolean;
  status: 'HEALTHY' | 'WARNING' | 'BLOCKED';
  message: string;
}

export function assessStorageBudget(
  currentSizeBytes: number,
  incomingSizeBytes: number
): StorageBudgetAssessment {
  const projectedTotalBytes = currentSizeBytes + incomingSizeBytes;

  if (projectedTotalBytes >= ZERO_COST_LIMITS.TARGET_STORAGE_BYTES) {
    return {
      currentSizeBytes,
      incomingSizeBytes,
      projectedTotalBytes,
      allowed: false,
      status: 'BLOCKED',
      message: `Upload blocked! Projected storage (${(projectedTotalBytes / (1024 ** 3)).toFixed(2)} GB) exceeds safety limit (${ZERO_COST_LIMITS.TARGET_STORAGE_BYTES / (1024 ** 3)} GB).`
    };
  }

  if (projectedTotalBytes >= ZERO_COST_LIMITS.WARNING_THRESHOLD_BYTES) {
    return {
      currentSizeBytes,
      incomingSizeBytes,
      projectedTotalBytes,
      allowed: true,
      status: 'WARNING',
      message: `Warning: Projected storage (${(projectedTotalBytes / (1024 ** 3)).toFixed(2)} GB) is approaching the 8 GB limit.`
    };
  }

  return {
    currentSizeBytes,
    incomingSizeBytes,
    projectedTotalBytes,
    allowed: true,
    status: 'HEALTHY',
    message: 'Storage within safe operational bounds.'
  };
}
