import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Play, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const FrameDetector = () => {
  const [inputFrames, setInputFrames] = useState('1,2,3,5,6')
  const [results, setResults] = useState<{
    input: number[]
    missing: number[]
  } | null>(null)

  const findMissingFrames = (frames: number[]): number[] => {
    if (!Array.isArray(frames) || frames.length === 0) {
      return []
    }

    const missingFrames: number[] = []
    let expectedFrame: number = 1

    for (const currentFrame of frames) {
      if (currentFrame > expectedFrame) {
        for (let j = expectedFrame; j < currentFrame; j++) {
          missingFrames.push(j)
        }
      }
      expectedFrame = currentFrame + 1
    }

    return missingFrames
  }

  const analyzeFrames = () => {
    try {
      const frames = inputFrames
        .split(',')
        .map(f => parseInt(f.trim()))
        .filter(f => !isNaN(f) && f > 0)
        .sort((a, b) => a - b)

      if (frames.length === 0) {
        toast({
          title: 'خطأ في الإدخال',
          description: 'يرجى إدخال أرقام إطارات صحيحة',
          variant: 'destructive',
        })
        return
      }

      const missing = findMissingFrames(frames)
      setResults({ input: frames, missing })

      toast({
        title: 'تم التحليل بنجاح',
        description: `تم العثور على ${missing.length} إطار مفقود`,
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

  const renderFrameVisualization = () => {
    if (!results) return null

    const maxFrame = Math.max(...results.input)
    const allFrames = Array.from({ length: maxFrame }, (_, i) => i + 1)

    return (
      <div className='space-y-4'>
        <h4 className='text-base md:text-lg font-semibold text-primary'>التمثيل المرئي للإطارات</h4>
        <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 md:gap-2 p-2 md:p-4 bg-card/50 rounded-lg border border-primary/20'>
          {allFrames.map(frame => {
            const isReceived = results.input.includes(frame)
            const isMissing = results.missing.includes(frame)

            return (
              <div
                key={frame}
                className={`frame-cell text-xs md:text-sm ${
                  isReceived ? 'received' : isMissing ? 'missing' : ''
                }`}
                title={isReceived ? 'إطار مستلم' : 'إطار مفقود'}
              >
                {frame}
              </div>
            )
          })}
        </div>

        <div className='flex flex-col sm:flex-row gap-2 md:gap-4 text-xs md:text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-accent rounded border-2 border-accent'></div>
            <span>إطارات مستلمة ({results.input.length})</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-destructive/20 rounded border-2 border-destructive animate-pulse-red'></div>
            <span>إطارات مفقودة ({results.missing.length})</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='space-y-3 md:space-y-4'>
        <div>
          <Label htmlFor='frames-input' className='text-sm md:text-base font-medium'>
            أرقام الإطارات المستلمة
          </Label>
          <p className='text-xs md:text-sm text-muted-foreground mb-2'>
            أدخل أرقام الإطارات مفصولة بفواصل (مثال: 1,2,3,5,6)
          </p>
          <Input
            id='frames-input'
            value={inputFrames}
            onChange={e => setInputFrames(e.target.value)}
            placeholder='1,2,3,5,6'
            className='font-mono text-sm md:text-base'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2'>
          <Button onClick={analyzeFrames} className='cyber-btn text-sm md:text-base'>
            <Play className='w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2' />
            تحليل الإطارات
          </Button>
          <Button variant='outline' onClick={clearResults} className='text-sm md:text-base'>
            <Trash2 className='w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2' />
            مسح النتائج
          </Button>
        </div>
      </div>

      {results && (
        <div className='space-y-4 md:space-y-6 animate-float-up'>
          <Card className='cyber-frame glow-blue'>
            <CardHeader className='p-3 md:p-6'>
              <CardTitle className='flex items-center gap-2 text-base md:text-lg'>
                {results.missing.length > 0 ? (
                  <AlertCircle className='w-4 h-4 md:w-5 md:h-5 text-destructive' />
                ) : (
                  <CheckCircle className='w-4 h-4 md:w-5 md:h-5 text-accent' />
                )}
                نتائج التحليل
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 md:p-6 space-y-3 md:space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4'>
                <div className='text-center p-3 md:p-4 bg-primary/10 rounded-lg'>
                  <div className='text-xl md:text-2xl font-bold text-primary'>
                    {results.input.length}
                  </div>
                  <div className='text-xs md:text-sm text-muted-foreground'>إطارات مستلمة</div>
                </div>
                <div className='text-center p-3 md:p-4 bg-destructive/10 rounded-lg'>
                  <div className='text-xl md:text-2xl font-bold text-destructive'>
                    {results.missing.length}
                  </div>
                  <div className='text-xs md:text-sm text-muted-foreground'>إطارات مفقودة</div>
                </div>
                <div className='text-center p-3 md:p-4 bg-accent/10 rounded-lg'>
                  <div className='text-xl md:text-2xl font-bold text-accent'>
                    {(
                      (results.input.length / (results.input.length + results.missing.length)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className='text-xs md:text-sm text-muted-foreground'>معدل النجاح</div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='font-semibold text-sm md:text-base'>الإطارات المستلمة:</h4>
                <div className='flex flex-wrap gap-1'>
                  {results.input.map(frame => (
                    <Badge
                      key={frame}
                      variant='secondary'
                      className='bg-accent/20 text-accent text-xs md:text-sm'
                    >
                      {frame}
                    </Badge>
                  ))}
                </div>
              </div>

              {results.missing.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-semibold text-destructive text-sm md:text-base'>
                    الإطارات المفقودة:
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {results.missing.map(frame => (
                      <Badge
                        key={frame}
                        variant='destructive'
                        className='animate-pulse-red text-xs md:text-sm'
                      >
                        {frame}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='cyber-frame'>
            <CardContent className='p-3 md:pt-6'>{renderFrameVisualization()}</CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default FrameDetector
