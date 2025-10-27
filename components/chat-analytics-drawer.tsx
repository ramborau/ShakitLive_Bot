"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { BarChart3, ShoppingCart, MapPin, CreditCard, Package, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ChatAnalyticsDrawerProps {
  threadId: string;
  thread?: any;
}

export function ChatAnalyticsDrawer({ threadId, thread }: ChatAnalyticsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initiateFlow = async (flowType: string) => {
    try {
      const response = await fetch('/api/initiate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, flowType })
      });

      if (response.ok) {
        alert(`${flowType} flow initiated successfully!`);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error initiating flow:', error);
      alert('Failed to initiate flow');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <BarChart3 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Chat Analytics & Controls</SheetTitle>
          <SheetDescription>
            View insights and manage conversation flows
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="insights">AI</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Summary</CardTitle>
                <CardDescription>Key metrics for this chat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Messages</span>
                  <span className="font-medium">{thread?.messages?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Flow</span>
                  <span className="font-medium">{thread?.currentFlow || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Flow Step</span>
                  <span className="font-medium">{thread?.flowStep || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Activity</span>
                  <span className="font-medium text-xs">
                    {thread?.lastActivity ? new Date(thread.lastActivity).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Cart summary</CardDescription>
              </CardHeader>
              <CardContent>
                {thread?.flowData ? (
                  <div className="space-y-2">
                    <div className="font-mono text-xs bg-muted p-3 rounded-md">
                      <pre>{JSON.stringify(JSON.parse(thread.flowData), null, 2)}</pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No active cart</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Flow History</CardTitle>
                <CardDescription>Recent conversation flows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {thread?.currentFlow ? (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{thread.currentFlow}</p>
                        <p className="text-xs text-muted-foreground">{thread.flowStep}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No flow history</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>Gemini-powered insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Intent:</span>{' '}
                      {thread?.intent || 'Not detected'}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Language:</span>{' '}
                      {thread?.language || 'en'}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Needs Human:</span>{' '}
                      {thread?.needsHuman ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manual Flow Initiation</CardTitle>
                <CardDescription>Start a new conversation flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => initiateFlow('order')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Initiate Order Flow
                </Button>
                <Button
                  onClick={() => initiateFlow('supercard')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Initiate SuperCard Flow
                </Button>
                <Button
                  onClick={() => initiateFlow('location')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Initiate Location Flow
                </Button>
                <Button
                  onClick={() => initiateFlow('tracking')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Initiate Tracking Flow
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
