import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, BarChart3, Play, Trash2, TrendingUp } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AnalysisResult {
  input: number[]
  missingRanges: [number, number][]
  longestMissingRange: [number, number] | null
  totalMissingFrames: number
}

const FrameAnalyzer = () => {
  const [inputFrames, setInputFrames] = useState('1,2,5,8,9,15')
  const [results, setResults] = useState<AnalysisResult | null>(null)

  const findMissingFrames = (
    frames: number[]
  ): {
    missingRanges: [number, number][]
    longestMissingRange: [number, number] | null
    totalMissingFrames: number
  } => {
    if (!Array.isArray(frames) || frames.length === 0) {
      return {
        missingRanges: [],
        longestMissingRange: null,
        totalMissingFrames: 0,
      }
    }

    const sortedFrames = [...frames].sort((a, b) => a - b)
    const maxFrame = Math.max(...frames)
    const missingRanges: [number, number][] = []
    let longestMissingRange: [number, number] | null = null
    let totalMissingFrames: number = 0
    let expectedFrame: number = 1

    for (const currentFrame of sortedFrames) {
      if (currentFrame > expectedFrame) {
        const start = expectedFrame
        const end = currentFrame - 1
        const length = end - start + 1

        missingRanges.push([start, end])
        totalMissingFrames += length

        if (!longestMissingRange || length > longestMissingRange[1] - longestMissingRange[0] + 1) {
          longestMissingRange = [start, end]
        }
      }
      expectedFrame = currentFrame + 1
    }

    return {
      missingRanges,
      longestMissingRange,
      totalMissingFrames,
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

      const analysis = findMissingFrames(frames)
      setResults({
        input: frames.sort((a, b) => a - b),
        ...analysis,
      })

      toast({
        title: 'تم التحليل المتقدم بنجاح',
        description: `تم العثور على ${analysis.missingRanges.length} نطاق مفقود`,
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

  const renderRangeVisualization = () => {
    if (!results) return null

    const maxFrame = Math.max(...results.input)
    const allFrames = Array.from({ length: maxFrame }, (_, i) => i + 1)

    return (
      <div className='space-y-3 md:space-y-4'>
        <h4 className='text-base md:text-lg font-semibold text-primary'>التمثيل المرئي للنطاقات</h4>
        <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 p-2 md:p-4 bg-card/50 rounded-lg border border-primary/20'>
          {allFrames.map(frame => {
            const isReceived = results.input.includes(frame)
            const isInLongestRange =
              results.longestMissingRange &&
              frame >= results.longestMissingRange[0] &&
              frame <= results.longestMissingRange[1]

            return (
              <div
                key={frame}
                className={`frame-cell text-xs md:text-sm ${
                  isReceived
                    ? 'received'
                    : isInLongestRange
                    ? 'missing border-destructive border-4'
                    : 'missing'
                }`}
                title={
                  isReceived ? 'إطار مستلم' : isInLongestRange ? 'أطول نطاق مفقود' : 'إطار مفقود'
                }
              >
                {frame}
              </div>
            )
          })}
        </div>

        <div className='flex flex-col sm:flex-row gap-2 md:gap-4 text-xs md:text-sm flex-wrap'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-accent rounded border-2 border-accent'></div>
            <span>إطارات مستلمة</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-destructive/20 rounded border-2 border-destructive'></div>
            <span>إطارات مفقودة</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-destructive/20 rounded border-4 border-destructive'></div>
            <span>أطول نطاق مفقود</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='space-y-3 md:space-y-4'>
        <div>
          <Label htmlFor='advanced-frames-input' className='text-sm md:text-base font-medium'>
            أرقام الإطارات للتحليل المتقدم
          </Label>
          <p className='text-xs md:text-sm text-muted-foreground mb-2'>
            سيتم تحليل النطاقات المفقودة وتحديد أطول نطاق
          </p>
          <Input
            id='advanced-frames-input'
            value={inputFrames}
            onChange={e => setInputFrames(e.target.value)}
            placeholder='1,2,5,8,9,15'
            className='font-mono text-sm md:text-base'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2'>
          <Button onClick={analyzeFrames} className='cyber-btn text-sm md:text-base'>
            <BarChart3 className='w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2' />
            تحليل النطاقات
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
                <div className='text-xl md:text-2xl font-bold text-primary'>
                  {results.input.length}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>إطارات مستلمة</div>
              </CardContent>
            </Card>

            <Card className='cyber-frame glow-green'>
              <CardContent className='p-3 md:p-4 text-center'>
                <div className='text-xl md:text-2xl font-bold text-accent'>
                  {results.missingRanges.length}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>نطاقات مفقودة</div>
              </CardContent>
            </Card>

            <Card className='cyber-frame'>
              <CardContent className='p-3 md:p-4 text-center'>
                <div className='text-xl md:text-2xl font-bold text-destructive'>
                  {results.totalMissingFrames}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>إجمالي مفقود</div>
              </CardContent>
            </Card>

            <Card className='cyber-frame'>
              <CardContent className='p-3 md:p-4 text-center'>
                <div className='text-xl md:text-2xl font-bold text-primary'>
                  {results.longestMissingRange
                    ? results.longestMissingRange[1] - results.longestMissingRange[0] + 1
                    : 0}
                </div>
                <div className='text-xs md:text-sm text-muted-foreground'>أطول نطاق</div>
              </CardContent>
            </Card>
          </div>

          <Card className='cyber-frame'>
            <CardHeader className='p-4 md:p-6'>
              <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
                <TrendingUp className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                تحليل النطاقات المفصل
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 md:p-6 space-y-4 md:space-y-6'>
              {results.missingRanges.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='font-semibold text-destructive flex items-center gap-2 text-sm md:text-base'>
                    <AlertTriangle className='w-3 h-3 md:w-4 md:h-4' />
                    النطاقات المفقودة:
                  </h4>
                  <div className='space-y-2'>
                    {results.missingRanges.map((range, index) => {
                      const length = range[1] - range[0] + 1
                      const isLongest =
                        results.longestMissingRange &&
                        range[0] === results.longestMissingRange[0] &&
                        range[1] === results.longestMissingRange[1]

                      return (
                        <div
                          key={index}
                          className={`p-3 md:p-3 rounded-lg border ${
                            isLongest
                              ? 'bg-destructive/20 border-destructive border-2'
                              : 'bg-muted/50 border-muted'
                          }`}
                        >
                          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant={isLongest ? 'destructive' : 'secondary'}
                                className='text-xs md:text-sm'
                              >
                                {range[0] === range[1]
                                  ? `إطار ${range[0]}`
                                  : `${range[0]} - ${range[1]}`}
                              </Badge>
                              {isLongest && (
                                <Badge
                                  variant='outline'
                                  className='text-destructive border-destructive text-xs md:text-sm'
                                >
                                  أطول نطاق
                                </Badge>
                              )}
                            </div>
                            <div className='text-xs md:text-sm text-muted-foreground'>
                              {length} إطار مفقود
                            </div>
                          </div>
                          <Progress
                            value={(length / results.totalMissingFrames) * 100}
                            className='mt-2 h-2'
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {results.longestMissingRange && (
                <div className='p-3 md:p-4 bg-destructive/10 rounded-lg border border-destructive/20'>
                  <h4 className='font-semibold text-destructive mb-2 text-sm md:text-base'>
                    تفاصيل أطول نطاق مفقود:
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm'>
                    <div>
                      <span className='text-muted-foreground'>بداية النطاق: </span>
                      <span className='font-mono font-bold'>{results.longestMissingRange[0]}</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>نهاية النطاق: </span>
                      <span className='font-mono font-bold'>{results.longestMissingRange[1]}</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>طول النطاق: </span>
                      <span className='font-mono font-bold'>
                        {results.longestMissingRange[1] - results.longestMissingRange[0] + 1} إطار
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>نسبة الفقدان: </span>
                      <span className='font-mono font-bold'>
                        {(
                          ((results.longestMissingRange[1] - results.longestMissingRange[0] + 1) /
                            results.totalMissingFrames) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='cyber-frame'>
            <CardContent className='p-3 md:pt-6'>{renderRangeVisualization()}</CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default FrameAnalyzer
