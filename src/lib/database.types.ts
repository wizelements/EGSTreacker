export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          stripe_customer_id: string | null;
          subscription_status: "free" | "starter" | "pro" | "cancelled";
          subscription_period: "monthly" | "annual" | null;
          subscription_end_date: string | null;
          reports_used_this_month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: "free" | "starter" | "pro" | "cancelled";
          subscription_period?: "monthly" | "annual" | null;
          subscription_end_date?: string | null;
          reports_used_this_month?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: "free" | "starter" | "pro" | "cancelled";
          subscription_period?: "monthly" | "annual" | null;
          subscription_end_date?: string | null;
          reports_used_this_month?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      esg_reports: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          industry: string;
          employee_count: number | null;
          annual_revenue: number | null;
          environmental_score: number | null;
          social_score: number | null;
          governance_score: number | null;
          overall_score: number | null;
          summary: string | null;
          environmental_details: string | null;
          social_details: string | null;
          governance_details: string | null;
          compliance_status: string | null;
          recommendations: Json | null;
          input_data: Json | null;
          is_guest_report: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          industry: string;
          employee_count?: number | null;
          annual_revenue?: number | null;
          environmental_score?: number | null;
          social_score?: number | null;
          governance_score?: number | null;
          overall_score?: number | null;
          summary?: string | null;
          environmental_details?: string | null;
          social_details?: string | null;
          governance_details?: string | null;
          compliance_status?: string | null;
          recommendations?: Json | null;
          input_data?: Json | null;
          is_guest_report?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          industry?: string;
          employee_count?: number | null;
          annual_revenue?: number | null;
          environmental_score?: number | null;
          social_score?: number | null;
          governance_score?: number | null;
          overall_score?: number | null;
          summary?: string | null;
          environmental_details?: string | null;
          social_details?: string | null;
          governance_details?: string | null;
          compliance_status?: string | null;
          recommendations?: Json | null;
          input_data?: Json | null;
          is_guest_report?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ESGReport = Database["public"]["Tables"]["esg_reports"]["Row"];
