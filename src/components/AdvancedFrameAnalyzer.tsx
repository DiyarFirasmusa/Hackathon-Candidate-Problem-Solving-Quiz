import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Cpu, Shield, Play, Trash2, Zap, AlertTriangle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AdvancedAnalysisResult {
  input: number[]
  gaps: [number, number][]
  longest_gap: [number, number] | null
  missing_count: number
}

const AdvancedFrameAnalyzer = () => {
  const [inputFrames, setInputFrames] = useState('1,2,3,5,6,10,11,16')
  const [results, setResults] = useState<AdvancedAnalysisResult | null>(null)

  const findMissingFrameData = (
    frames: number[]
  ): {
    gaps: [number, number][]
    longest_gap: [number, number] | null
    missing_count: number
  } => {
    if (!frames || frames.length === 0) {
      return {
        gaps: [],
        longest_gap: null,
        missing_count: 0,
      }
    }

    const frameSet: Set<number> = new Set(frames)
    const maxFrame: number = Math.max(...frames)

    const gaps: [number, number][] = []
    let longestGap: [number, number] | null = null
    let missingCount: number = 0

    let currentGapStart: number | null = null

    for (let i = 1; i <= maxFrame; i++) {
      if (!frameSet.has(i)) {
        missingCount++
        if (currentGapStart === null) {
          currentGapStart = i
        }
      } else {
        if (currentGapStart !== null) {
          const gap: [number, number] = [currentGapStart, i - 1]
          gaps.push(gap)
          if (!longestGap || gap[1] - gap[0] + 1 > longestGap[1] - longestGap[0] + 1) {
            longestGap = gap
          }
          currentGapStart = null
        }
      }
    }

    if (currentGapStart !== null) {
      const gap: [number, number] = [currentGapStart, maxFrame]
      gaps.push(gap)
      if (!longestGap || gap[1] - gap[0] + 1 > longestGap[1] - longestGap[0] + 1) {
        longestGap = gap
      }
    }

    return {
      gaps,
      longest_gap: longestGap,
      missing_count: missingCount,
    }
  }

  const analyzeFrames = () => {
    try {
      const frames = inputFrames
        .split(',')
        .map(f => parseInt(f.trim()))
        .filter(f => !isNaN(f) && f > 0)

      if (frames.length === 0) {
        toast({
          title: 'خطأ في الإدخال',
          description: 'يرجى إدخال أرقام إطارات صحيحة',
          variant: 'destructive',
        })
        return
      }

      const analysis = findMissingFrameData(frames)
      setResults({
        input: frames,
        ...analysis,
      })

      toast({
        title: 'تم التحليل الاحترافي بنجاح',
        description: `تم استخدام خوارزمية متقدمة بدون ترتيب مدمج`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'خطأ في التحليل',
        description: 'تحقق من صيغة الإدخال',
        variant: 'destructive',
      })
    }
  }

  const clearResults = () => {
    setResults(null)
    setInputFrames('')
  }

  const renderAdvancedVisualization = () => {
    if (!results) return null

    const maxFrame = Math.max(...results.input)
    const allFrames = Array.from({ length: maxFrame }, (_, i) => i + 1)
    const frameSet = new Set(results.input)

    return (
      <div className='space-y-4 md:space-y-6'>
        <div className='text-center'>
          <h4 className='text-base md:text-lg font-semibold text-primary mb-2'>
            التحليل الاحترافي المرئي
          </h4>
          <p className='text-xs md:text-sm text-muted-foreground'>
            خوارزمية متقدمة باستخدام Hash Set للأداء الأمثل
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20'>
          <div className='text-center'>
            <div className='text-base md:text-lg font-bold text-accent'>O(n)</div>
            <div className='text-xs text-muted-foreground'>Time Complexity</div>
          </div>
          <div className='text-center'>
            <div className='text-base md:text-lg font-bold text-primary'>O(n)</div>
            <div className='text-xs text-muted-foreground'>Space Complexity</div>
          </div>
          <div className='text-center'>
            <div className='text-base md:text-lg font-bold text-destructive'>
              {((1 - results.missing_count / maxFrame) * 100).toFixed(1)}%
            </div>
            <div className='text-xs text-muted-foreground'>Efficiency</div>
          </div>
          <div className='text-center'>
            <div className='text-base md:text-lg font-bold text-accent'>{results.input.length}</div>
            <div className='text-xs text-muted-foreground'>Data Points</div>
          </div>
        </div>

        <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 p-3 md:p-4 bg-card/50 rounded-lg border border-primary/20'>
          {allFrames.map(frame => {
            const isReceived = frameSet.has(frame)
            const isInLongestGap =
              results.longest_gap &&
              frame >= results.longest_gap[0] &&
              frame <= results.longest_gap[1]

            return (
              <div
                key={frame}
                className={`frame-cell text-xs md:text-sm ${
                  isReceived
                    ? 'received'
                    : isInLongestGap
                    ? 'missing border-destructive border-4 animate-pulse-red'
                    : 'missing'
                }`}
                title={
                  isReceived
                    ? `إطار مستلم: ${frame}`
                    : isInLongestGap
                    ? `أطول فجوة: ${frame}`
                    : `إطار مفقود: ${frame}`
                }
              >
                {frame}
              </div>
            )
          })}
        </div>

        <div className='flex flex-col sm:flex-row justify-center gap-3 md:gap-6 text-xs md:text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-accent rounded border-2 border-accent glow-green'></div>
            <span>إطارات مستلمة</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-destructive/20 rounded border-2 border-destructive'></div>
            <span>فجوات عادية</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-destructive/20 rounded border-4 border-destructive animate-pulse-red'></div>
            <span>أطول فجوة</span>
          </div>
        </div>
      </div>
    )
  }

  const renderGapAnalysis = () => {
    if (!results || results.gaps.length === 0) return null

    return (
      <div className='space-y-3 md:space-y-4'>
        <h4 className='font-semibold text-destructive flex items-center gap-2 text-sm md:text-base'>
          <AlertTriangle className='w-3 h-3 md:w-4 md:h-4' />
          تحليل الفجوات المفصل:
        </h4>
        <div className='space-y-3'>
          {results.gaps.map((gap, index) => {
            const length = gap[1] - gap[0] + 1
            const isLongest =
              results.longest_gap &&
              gap[0] === results.longest_gap[0] &&
              gap[1] === results.longest_gap[1]

            return (
              <div
                key={index}
                className={`p-3 md:p-4 rounded-lg border transition-all duration-300 ${
                  isLongest
                    ? 'bg-destructive/20 border-destructive border-2 glow-green'
                    : 'bg-muted/50 border-muted hover:border-primary/30'
                }`}
              >
                <div className='flex flex-col sm:flex-row justify-between items-start gap-3'>
                  <div className='space-y-1'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                      <Badge
                        variant={isLongest ? 'destructive' : 'secondary'}
                        className='font-mono text-xs md:text-sm'
                      >
                        [{gap[0]}, {gap[1]}]
                      </Badge>
                      {isLongest && (
                        <Badge
                          variant='outline'
                          className='text-destructive border-destructive animate-pulse text-xs md:text-sm'
                        >
                          <Zap className='w-3 h-3 mr-1' />
                          أطول فجوة
                        </Badge>
                      )}
                    </div>
                    <p className='text-xs md:text-sm text-muted-foreground'>
                      {gap[0] === gap[1] ? `إطار واحد مفقود` : `نطاق من ${gap[0]} إلى ${gap[1]}`}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-base md:text-lg font-bold text-destructive'>{length}</div>
                    <div className='text-xs text-muted-foreground'>إطار مفقود</div>
                  </div>
                </div>

                <div className='space-y-2 mt-3'>
                  <div className='flex justify-between text-xs md:text-sm'>
                    <span>تأثير الفجوة:</span>
                    <span className='font-semibold'>
                      {((length / results.missing_count) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(length / results.missing_count) * 100}
                    className={`h-2 ${isLongest ? 'animate-pulse' : ''}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <Card className='cyber-frame glow-blue'>
        <CardContent className='p-3 md:p-4'>
          <div className='flex items-center gap-2 md:gap-3 mb-2'>
            <Cpu className='w-4 h-4 md:w-5 md:h-5 text-primary' />
            <h3 className='font-semibold text-primary text-sm md:text-base'>
              خوارزمية Hash Set المتقدمة
            </h3>
          </div>
          <p className='text-xs md:text-sm text-muted-foreground'>
            تستخدم هذه الخوارزمية تقنية Hash Set للوصول السريع O(1) مع تعقيد زمني إجمالي O(n) دون
            الحاجة لترتيب البيانات، مما يجعلها مثالية للتطبيقات عالية الأداء.
          </p>
        </CardContent>
      </Card>

      <div className='space-y-3 md:space-y-4'>
        <div>
          <Label
            htmlFor='professional-frames-input'
            className='text-sm md:text-base font-medium flex items-center gap-2'
          >
            <Shield className='w-3 h-3 md:w-4 md:h-4 text-primary' />
            إدخال البيانات للتحليل الاحترافي
          </Label>
          <p className='text-xs md:text-sm text-muted-foreground mb-2'>
            سيتم التحليل باستخدام خوارزمية Hash Set المتقدمة
          </p>
          <Input
            id='professional-frames-input'
            value={inputFrames}
            onChange={e => setInputFrames(e.target.value)}
            placeholder='1,2,3,5,6,10,11,16'
            className='font-mono text-sm md:text-base'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2'>
          <Button onClick={analyzeFrames} className='cyber-btn text-sm md:text-base'>
            <Cpu className='w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2' />
            تشغيل التحليل الاحترافي
          </Button>
          <Button variant='outline' onClick={clearResults} className='text-sm md:text-base'>
            <Trash2 className='w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2' />
            مسح النتائج
          </Button>
        </div>
      </div>

      {results && (
        <div className='space-y-4 md:space-y-6 animate-float-up'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
            <Card className='cyber-frame glow-blue'>
              <CardContent className='p-3 md:p-4 text-center'>
                <Zap className='w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2' />
                <div className='text-xl md:text-2xl font-bold text-primary'>
                  {results.input.length}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>إطارات مستلمة</div>
              </CardContent>
            </Card>

            <Card className='cyber-frame'>
              <CardContent className='p-3 md:p-4 text-center'>
                <AlertTriangle className='w-5 h-5 md:w-6 md:h-6 text-destructive mx-auto mb-2' />
                <div className='text-xl md:text-2xl font-bold text-destructive'>
                  {results.gaps.length}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>فجوات مكتشفة</div>
              </CardContent>
            </Card>

            <Card className='cyber-frame'>
              <CardContent className='p-3 md:p-4 text-center'>
                <Cpu className='w-5 h-5 md:w-6 md:h-6 text-accent mx-auto mb-2' />
                <div className='text-xl md:text-2xl font-bold text-accent'>
                  {results.missing_count}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>إجمالي مفقود</div>
              </CardContent>
            </Card>

            <Card className='cyber-frame glow-green'>
              <CardContent className='p-3 md:p-4 text-center'>
                <Shield className='w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2' />
                <div className='text-xl md:text-2xl font-bold text-primary'>
                  {results.longest_gap ? results.longest_gap[1] - results.longest_gap[0] + 1 : 0}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>أطول فجوة</div>
              </CardContent>
            </Card>
          </div>

          <Card className='cyber-frame'>
            <CardHeader className='p-4 md:p-6'>
              <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
                <Cpu className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                التحليل التفصيلي للخوارزمية
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 md:p-6 space-y-4 md:space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <div className='space-y-3'>
                  <h4 className='font-semibold text-accent text-sm md:text-base'>مقاييس الأداء:</h4>
                  <div className='space-y-2 text-xs md:text-sm'>
                    <div className='flex justify-between'>
                      <span>التعقيد الزمني:</span>
                      <Badge variant='secondary' className='font-mono text-xs'>
                        O(n)
                      </Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span>التعقيد المكاني:</span>
                      <Badge variant='secondary' className='font-mono text-xs'>
                        O(n)
                      </Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span>استراتيجية البحث:</span>
                      <Badge variant='outline' className='text-xs'>
                        Hash Set
                      </Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span>الترتيب المطلوب:</span>
                      <Badge variant='destructive' className='text-xs'>
                        غير مطلوب
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h4 className='font-semibold text-primary text-sm md:text-base'>
                    إحصائيات التحليل:
                  </h4>
                  <div className='space-y-2 text-xs md:text-sm'>
                    <div className='flex justify-between'>
                      <span>معدل النجاح:</span>
                      <span className='font-bold text-accent'>
                        {(
                          (results.input.length / (results.input.length + results.missing_count)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>معدل الفقدان:</span>
                      <span className='font-bold text-destructive'>
                        {(
                          (results.missing_count / (results.input.length + results.missing_count)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>كثافة الفجوات:</span>
                      <span className='font-bold'>
                        {((results.gaps.length / Math.max(...results.input)) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {renderGapAnalysis()}
            </CardContent>
          </Card>

          <Card className='cyber-frame'>
            <CardContent className='p-3 md:pt-6'>{renderAdvancedVisualization()}</CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdvancedFrameAnalyzer
