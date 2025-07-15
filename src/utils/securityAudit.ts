import { supabase } from "@/integrations/supabase/client";

export class SecurityAuditLogger {
  /**
   * Log security-related actions for monitoring and compliance
   * Modified for public use - logs without requiring authentication
   */
  static async logAction(
    action: string,
    resourceType: string,
    resourceId?: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    try {
      // For public mode, we still log but without user context
      const userAgent = navigator.userAgent;
      const timestamp = new Date().toISOString();
      
      // Store audit logs in localStorage for public mode
      const auditLog = {
        timestamp,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        user_agent: userAgent,
        session_id: this.getOrCreateSessionId(),
        ...additionalData
      };

      // Save to localStorage for public audit trail
      this.saveAuditLogLocally(auditLog);
      
      console.log(`Security action logged (public mode): ${action} on ${resourceType}${resourceId ? ` (${resourceId})` : ''}`);
    } catch (error) {
      console.error("Error in security audit logging:", error);
    }
  }

  /**
   * Generate or retrieve session ID for public users
   */
  private static getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('public_session_id');
    if (!sessionId) {
      sessionId = 'pub_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('public_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Save audit log to localStorage
   */
  private static saveAuditLogLocally(auditLog: any): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
      existingLogs.push(auditLog);
      
      // Keep only last 100 logs to prevent storage bloat
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem('audit_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error("Error saving audit log locally:", error);
    }
  }

  /**
   * Log recipe-related actions
   */
  static async logRecipeAction(action: 'create' | 'view' | 'update' | 'delete' | 'share', recipeId: string): Promise<void> {
    await this.logAction(`recipe_${action}`, 'recipe', recipeId);
  }

  /**
   * Log authentication-related actions (disabled in public mode)
   */
  static async logAuthAction(action: 'login' | 'logout' | 'signup' | 'password_reset'): Promise<void> {
    console.log(`Auth action skipped in public mode: ${action}`);
  }

  /**
   * Log image upload actions
   */
  static async logImageAction(action: 'upload' | 'delete', imageUrl?: string): Promise<void> {
    await this.logAction(`image_${action}`, 'image', imageUrl);
  }
}
