import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  FileText,
  TrendingUp,
  Calendar,
  Crown,
  Settings,
  LogOut,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: reports } = await supabase
    .from("esg_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const reportLimit =
    profile?.subscription_status === "pro"
      ? Infinity
      : profile?.subscription_status === "starter"
      ? 3
      : 1;

  const reportsUsed = profile?.reports_used_this_month || 0;
  const reportsRemaining = Math.max(0, reportLimit - reportsUsed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ESG</span>
            </div>
            <span className="font-bold text-xl">ESGTracker</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your ESG reports and track progress
            </p>
          </div>
          <Link href="/generate">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reports This Month</CardDescription>
              <CardTitle className="text-3xl">{reportsUsed}</CardTitle>
            </CardHeader>
            <CardContent>
              {reportLimit !== Infinity && (
                <>
                  <Progress
                    value={(reportsUsed / reportLimit) * 100}
                    className="h-2 mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {reportsRemaining} remaining
                  </p>
                </>
              )}
              {reportLimit === Infinity && (
                <p className="text-sm text-muted-foreground">Unlimited</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Plan</CardDescription>
              <CardTitle className="text-3xl capitalize flex items-center gap-2">
                {profile?.subscription_status === "pro" && (
                  <Crown className="h-6 w-6 text-yellow-500" />
                )}
                {profile?.subscription_status || "Free"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.subscription_status === "free" && (
                <Link href="/#pricing">
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </Link>
              )}
              {profile?.subscription_end_date && (
                <p className="text-sm text-muted-foreground">
                  Renews {formatDate(profile.subscription_end_date)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reports</CardDescription>
              <CardTitle className="text-3xl">{reports?.length || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest ESG assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {reports && reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/report/${report.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{report.company_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.industry} • {formatDate(report.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {report.overall_score}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ESG Score
                          </p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No reports yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first ESG report to get started
                </p>
                <Link href="/generate">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
