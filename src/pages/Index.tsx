import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor, Activity, Shield, Target } from 'lucide-react'
import FrameDetector from '@/components/FrameDetector'
import FrameAnalyzer from '@/components/FrameAnalyzer'
import AdvancedFrameAnalyzer from '@/components/AdvancedFrameAnalyzer'
import heroImage from '@/assets/hero-surveillance.jpg'

const Index = () => {
  return (
    <div className='min-h-screen bg-background grid-bg'>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src={heroImage}
            alt='Video Frame Detective - نظام كشف الإطارات المفقودة'
            className='w-full h-full object-cover opacity-20'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background'></div>
        </div>

        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10'></div>
        <div className='relative z-10 container mx-auto px-4 py-8 md:py-16'>
          <div className='text-center mb-6 md:mb-8'>
            <div className='flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4'>
              <Monitor className='w-6 h-6 md:w-8 md:h-8 text-primary' />
              <h1 className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                Video Frame Detective
              </h1>
              <Shield className='w-6 h-6 md:w-8 md:h-8 text-accent' />
            </div>
            <p className='text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2'>
              نظام متطور لكشف الإطارات المفقودة في المراقبة الذكية
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-2 mt-3 md:mt-4'>
              <Badge variant='secondary' className='cyber-frame text-xs md:text-sm'>
                <Activity className='w-3 h-3 md:w-4 md:h-4 mr-1' />
                Real-time Detection
              </Badge>
              <Badge variant='secondary' className='cyber-frame text-xs md:text-sm'>
                <Target className='w-3 h-3 md:w-4 md:h-4 mr-1' />
                Advanced Analytics
              </Badge>
            </div>
          </div>

          <div className='max-w-6xl mx-auto '>
            <Tabs defaultValue='basic' className='space-y-4 md:space-y-6'>
              <TabsList className='grid w-full mb-20 sm:mb-0 grid-cols-1 sm:grid-cols-3 bg-card border border-primary/20'>
                <TabsTrigger
                  value='basic'
                  className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm'
                >
                  Detecting Missing Video Frames
                </TabsTrigger>
                <TabsTrigger
                  value='advanced'
                  className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm'
                >
                  Missing Frame Ranges Analysis
                </TabsTrigger>
                <TabsTrigger
                  value='professional'
                  className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm'
                >
                  Find Missing Ranges (No Sort)
                </TabsTrigger>
              </TabsList>

              <TabsContent value='basic' className='animate-float-up'>
                <Card className='cyber-frame'>
                  <CardHeader className='p-4 md:p-6'>
                    <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
                      <Activity className='w-4 h-4 md:w-5 md:h-5 text-accent' />
                      كاشف الإطارات المفقودة الأساسي
                    </CardTitle>
                    <CardDescription className='text-sm'>
                      يكتشف الإطارات المفقودة في تسلسل رقمي بسيط
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-4 md:p-6'>
                    <FrameDetector />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='advanced' className='animate-float-up'>
                <Card className='cyber-frame'>
                  <CardHeader className='p-4 md:p-6'>
                    <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
                      <Target className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                      محلل النطاقات المتقدم
                    </CardTitle>
                    <CardDescription className='text-sm'>
                      يحلل النطاقات المفقودة ويحدد أطول نطاق مفقود
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-4 md:p-6'>
                    <FrameAnalyzer />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='professional' className='animate-float-up'>
                <Card className='cyber-frame'>
                  <CardHeader className='p-4 md:p-6'>
                    <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
                      <Shield className='w-4 h-4 md:w-5 md:h-5 text-destructive' />
                      المحلل الاحترافي (بدون ترتيب)
                    </CardTitle>
                    <CardDescription className='text-sm'>
                      تحليل متقدم للإطارات بدون استخدام خوارزميات الترتيب المدمجة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-4 md:p-6'>
                    <AdvancedFrameAnalyzer />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
