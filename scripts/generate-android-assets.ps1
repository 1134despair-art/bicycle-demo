param(
  [string]$LogoPath = "public/media/l-twoo-logo.png",
  [string]$AndroidResourcesPath = "android/app/src/main/res",
  [string]$SourceAssetsPath = "resources"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$brandColor = [System.Drawing.Color]::FromArgb(255, 127, 0)
$transparent = [System.Drawing.Color]::Transparent
$logo = [System.Drawing.Image]::FromFile((Resolve-Path $LogoPath))

function New-CanvasImage {
  param(
    [int]$Width,
    [int]$Height,
    [string]$OutputPath,
    [double]$LogoWidthRatio,
    [System.Drawing.Color]$BackgroundColor
  )

  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

  try {
    $graphics.Clear($BackgroundColor)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $targetWidth = [int]($Width * $LogoWidthRatio)
    $targetHeight = [int]($targetWidth * $logo.Height / $logo.Width)
    $targetX = [int](($Width - $targetWidth) / 2)
    $targetY = [int](($Height - $targetHeight) / 2)
    $graphics.DrawImage($logo, $targetX, $targetY, $targetWidth, $targetHeight)

    $parentPath = Split-Path -Parent $OutputPath
    if ($parentPath) {
      New-Item -ItemType Directory -Force -Path $parentPath | Out-Null
    }

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

function Get-PngDimensions {
  param([string]$Path)

  $image = [System.Drawing.Image]::FromFile($Path)
  try {
    return @($image.Width, $image.Height)
  }
  finally {
    $image.Dispose()
  }
}

try {
  New-Item -ItemType Directory -Force -Path $SourceAssetsPath | Out-Null
  New-CanvasImage -Width 1024 -Height 1024 -OutputPath "$SourceAssetsPath/icon-only.png" -LogoWidthRatio 0.78 -BackgroundColor $brandColor
  New-CanvasImage -Width 1024 -Height 1024 -OutputPath "$SourceAssetsPath/icon-foreground.png" -LogoWidthRatio 0.62 -BackgroundColor $transparent
  New-CanvasImage -Width 2732 -Height 2732 -OutputPath "$SourceAssetsPath/splash.png" -LogoWidthRatio 0.58 -BackgroundColor $brandColor

  $densitySizes = @{
    "mdpi" = @(48, 108)
    "hdpi" = @(72, 162)
    "xhdpi" = @(96, 216)
    "xxhdpi" = @(144, 324)
    "xxxhdpi" = @(192, 432)
  }

  foreach ($density in $densitySizes.Keys) {
    $legacySize = $densitySizes[$density][0]
    $foregroundSize = $densitySizes[$density][1]
    $mipmapPath = Join-Path $AndroidResourcesPath "mipmap-$density"

    New-CanvasImage -Width $legacySize -Height $legacySize -OutputPath "$mipmapPath/ic_launcher.png" -LogoWidthRatio 0.78 -BackgroundColor $brandColor
    New-CanvasImage -Width $legacySize -Height $legacySize -OutputPath "$mipmapPath/ic_launcher_round.png" -LogoWidthRatio 0.78 -BackgroundColor $brandColor
    New-CanvasImage -Width $foregroundSize -Height $foregroundSize -OutputPath "$mipmapPath/ic_launcher_foreground.png" -LogoWidthRatio 0.62 -BackgroundColor $transparent
  }

  Get-ChildItem -Path $AndroidResourcesPath -Recurse -Filter "splash.png" | ForEach-Object {
    $dimensions = Get-PngDimensions -Path $_.FullName
    New-CanvasImage -Width $dimensions[0] -Height $dimensions[1] -OutputPath $_.FullName -LogoWidthRatio 0.58 -BackgroundColor $brandColor
  }
}
finally {
  $logo.Dispose()
}
