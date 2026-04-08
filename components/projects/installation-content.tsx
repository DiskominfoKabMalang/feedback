'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, ExternalLink, Download, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

interface InstallData {
  script_snippet: string
  public_link: string
  qr_code_url: string
  project_id: string
  project_name: string
  app_url: string
}

interface InstallationContentProps {
  projectId: string
}

export function InstallationContent({ projectId }: InstallationContentProps) {
  const [data, setData] = useState<InstallData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/dashboard/projects/${projectId}/install`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [projectId])

  const copyToClipboard = async (text: string, key: string) => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err)
          throw err
        }
        document.body.removeChild(textArea)
      }
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
      toast.success('Berhasil disalin!')
    } catch (err) {
      toast.error('Gagal menyalin ke clipboard')
      console.error('Failed to copy:', err)
    }
  }

  // Generate embed examples
  const getEmbedExamples = () => {
    if (!data) return { html: '', php: '', js: '' }

    const appUrl = data.app_url || window.location.origin
    const projectId = data.project_id

    return {
      html: `<!-- Echo Feedback Widget -->
<div id="feedback-widget"></div>
<script src="${appUrl}/widget/widget.js" data-project-id="${projectId}"></script>
<script>
  FeedbackWidget.init({
    projectId: "${projectId}",
    apiEndpoint: "${appUrl}",
    position: "bottom-right",
    theme: "light"
  });
</script>`,

      php: `<?php
// Echo Feedback Widget - PHP Integration
$appUrl = "${appUrl}";
$projectId = "${projectId}";
?>
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your content here -->

    <!-- Feedback Widget -->
    <div id="feedback-widget"></div>
    <script src="<?php echo $appUrl; ?>/widget/widget.js" data-project-id="<?php echo $projectId; ?>"></script>
    <script>
        FeedbackWidget.init({
            projectId: "<?php echo $projectId; ?>",
            apiEndpoint: "<?php echo $appUrl; ?>",
            position: "bottom-right",
            theme: "light"
        });
    </script>
</body>
</html>`,

      js: `// Echo Feedback Widget - JavaScript/React Integration

// Pure JavaScript (ES6)
import { FeedbackWidget } from '${appUrl}/widget/widget.js';

FeedbackWidget.init({
    projectId: '${projectId}',
    apiEndpoint: '${appUrl}',
    position: 'bottom-right',
    theme: 'light',
    autoOpen: false,
    buttonText: 'Feedback'
});

// React Example
// import { useEffect } from 'react';
//
// function FeedbackWidgetWrapper() {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = '${appUrl}/widget/widget.js';
//     script.setAttribute('data-project-id', '${projectId}');
//     script.async = true;
//     document.body.appendChild(script);
//
//     script.onload = () => {
//       if (window.FeedbackWidget) {
//         window.FeedbackWidget.init({
//           projectId: '${projectId}',
//           apiEndpoint: '${appUrl}'
//         });
//       }
//     };
//   }, []);
//
//   return <div id="feedback-widget" />;
// }`,
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Memuat...</div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Gagal memuat data instalasi
      </div>
    )
  }

  const embedExamples = getEmbedExamples()

  return (
    <Tabs defaultValue="script" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="script">Embed Script</TabsTrigger>
        <TabsTrigger value="examples">Contoh Kode</TabsTrigger>
        <TabsTrigger value="link">Link Publik</TabsTrigger>
        <TabsTrigger value="qr">QR Code</TabsTrigger>
      </TabsList>

      {/* Script Embed */}
      <TabsContent value="script">
        <Card>
          <CardHeader>
            <CardTitle>Embed di Website Anda</CardTitle>
            <CardDescription>
              Tambahkan script ini ke website Anda, sebaiknya sebelum tag{' '}
              <code className="bg-muted px-1 rounded">&lt;/body&gt;</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Script Snippet</Label>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{data.script_snippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(data.script_snippet, 'script')}
                >
                  {copied === 'script' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project ID</Label>
              <div className="flex gap-2">
                <Input value={data.project_id} readOnly />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(data.project_id, 'project-id')}
                >
                  {copied === 'project-id' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Code className="h-4 w-4" />
                Opsi Konfigurasi
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code className="bg-muted px-1 rounded">position</code>: <code className="bg-muted px-1 rounded">bottom-left</code>, <code className="bg-muted px-1 rounded">bottom-right</code></li>
                <li>• <code className="bg-muted px-1 rounded">theme</code>: <code className="bg-muted px-1 rounded">light</code>, <code className="bg-muted px-1 rounded">dark</code>, <code className="bg-muted px-1 rounded">auto</code></li>
                <li>• <code className="bg-muted px-1 rounded">buttonText</code>: Teks tombol kustom</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Code Examples */}
      <TabsContent value="examples">
        <Card>
          <CardHeader>
            <CardTitle>Contoh Integrasi</CardTitle>
            <CardDescription>
              Contoh kode untuk berbagai platform dan bahasa pemrograman
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
                <TabsTrigger value="js">JavaScript/React</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-4">
                <div className="space-y-2">
                  <Label>HTML Embed</Label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{embedExamples.html}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedExamples.html, 'html')}
                    >
                      {copied === 'html' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="php" className="space-y-4">
                <div className="space-y-2">
                  <Label>PHP Integration</Label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-80">
                      <code>{embedExamples.php}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedExamples.php, 'php')}
                    >
                      {copied === 'php' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="js" className="space-y-4">
                <div className="space-y-2">
                  <Label>JavaScript / React</Label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-80">
                      <code>{embedExamples.js}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedExamples.js, 'js')}
                    >
                      {copied === 'js' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Public Link */}
      <TabsContent value="link">
        <Card>
          <CardHeader>
            <CardTitle>Link Feedback Publik</CardTitle>
            <CardDescription>
              Bagikan link ini untuk mengumpulkan feedback langsung tanpa embed di website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Link Publik</Label>
              <div className="flex gap-2">
                <Input value={data.public_link} readOnly />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(data.public_link, 'link')}
                >
                  {copied === 'link' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={data.public_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Bagikan ke:</h4>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://wa.me/?text=Beri%20kami%20feedback%3A%20${encodeURIComponent(data.public_link)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`mailto:?subject=Feedback&body=Beri%20kami%20feedback%3A%20${encodeURIComponent(data.public_link)}`}
                  >
                    Share via Email
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* QR Code */}
      <TabsContent value="qr">
        <div className="grid gap-6 md:grid-cols-2">
          {/* QR Code Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.qr_code_url}
                    alt="Feedback QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">{data.project_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan untuk memberikan feedback
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = data.qr_code_url
                  link.download = `feedback-qr-${data.project_id}.png`
                  link.click()
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <a
                  href={data.public_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Buka Link
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Print Materials Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview untuk Print</CardTitle>
              <CardDescription>
                Gunakan QR code ini untuk materi cetak seperti poster, brosur, atau kartu nama.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mini Poster Preview */}
              <div className="border rounded-xl p-6 space-y-4 bg-gradient-to-br from-primary to-primary/80 text-white">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">Beri Kami Feedback!</h3>
                  <p className="text-sm text-white/90">
                    Pendapat Anda sangat berarti bagi kami. Scan QR code di bawah untuk memberikan feedback.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg w-fit mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.qr_code_url}
                    alt="QR Code"
                    className="w-24 h-24"
                  />
                </div>
                <p className="text-xs text-center text-white/80">
                  {data.public_link}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Tips Penggunaan:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cetak dalam ukuran minimal 5x5 cm</li>
                  <li>• Tempel di kasir, pintu keluar, atau meja</li>
                  <li>• Tambahkan teks &quot;Scan untuk feedback&quot;</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
