import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitHelper {
  /**
   * Commit and push blog changes to GitHub
   */
  static async commitAndPush(
    filePath: string,
    message: string,
    branchName?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get current branch if not specified
      if (!branchName) {
        const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD');
        branchName = stdout.trim();
      }

      // Add the specific file
      await execAsync(`git add "${filePath}"`);

      // Also add registry if it exists
      try {
        await execAsync('git add src/data/blog-registry.json');
      } catch (e) {
        // Registry might not exist yet, that's OK
      }

      // Commit with message
      await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`);

      // Push to origin
      const pushResult = await this.pushWithRetry(branchName);

      if (!pushResult.success) {
        return pushResult;
      }

      return {
        success: true,
        message: `Successfully committed and pushed to ${branchName}`
      };
    } catch (error: any) {
      console.error('Git commit/push error:', error);
      return {
        success: false,
        message: `Git error: ${error.message}`
      };
    }
  }

  /**
   * Push to GitHub with retry logic (exponential backoff)
   */
  private static async pushWithRetry(
    branchName: string,
    maxRetries: number = 4
  ): Promise<{ success: boolean; message: string }> {
    const delays = [2000, 4000, 8000, 16000]; // 2s, 4s, 8s, 16s

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await execAsync(`git push -u origin ${branchName}`);
        return {
          success: true,
          message: `Pushed to ${branchName} on attempt ${attempt + 1}`
        };
      } catch (error: any) {
        console.error(`Push attempt ${attempt + 1} failed:`, error.message);

        // Check if it's a network error or permission error
        const isNetworkError = error.message.includes('network') ||
                               error.message.includes('timeout') ||
                               error.message.includes('Connection');

        const is403Error = error.message.includes('403');

        if (is403Error) {
          return {
            success: false,
            message: 'Push rejected (403). Ensure branch name starts with "claude/" and matches session ID.'
          };
        }

        if (!isNetworkError || attempt === maxRetries - 1) {
          return {
            success: false,
            message: `Failed to push after ${attempt + 1} attempts: ${error.message}`
          };
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      }
    }

    return {
      success: false,
      message: 'Failed to push after all retries'
    };
  }

  /**
   * Get current git status
   */
  static async getStatus(): Promise<string> {
    try {
      const { stdout } = await execAsync('git status --short');
      return stdout;
    } catch (error: any) {
      return `Error getting git status: ${error.message}`;
    }
  }

  /**
   * Get current branch name
   */
  static async getCurrentBranch(): Promise<string> {
    try {
      const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD');
      return stdout.trim();
    } catch (error: any) {
      return 'unknown';
    }
  }
}
