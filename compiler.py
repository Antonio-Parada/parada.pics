import os
import json
from PIL import Image, ImageStat, ImageEnhance

def get_char_for_luminance(l):
    chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
    index = int(((255 - l) / 255) * (len(chars) - 1))
    return chars[index]

def compile_image_to_ascii(image_path, width=160, contrast=1.3):
    img = Image.open(image_path).convert('RGB')
    
    # Perceptual aspect ratio correction
    font_aspect_ratio = 0.55
    height = int((img.height / img.width) * width * font_aspect_ratio)
    img = img.resize((width, height), Image.Resampling.LANCZOS)

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(contrast)

    pixels = img.load()
    ascii_rows = []
    
    for y in range(height):
        row = ""
        for x in range(width):
            r, g, b = pixels[x, y]
            # Rec. 709 weighted luminance
            luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b)
            row += get_char_for_luminance(luminance)
        ascii_rows.append(row)
    
    return "\n".join(ascii_rows)

def process_gallery(source_dir, output_file):
    gallery = []
    valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    
    files = sorted([f for f in os.listdir(source_dir) if f.lower().endswith(valid_extensions)])
    
    for filename in files:
        print(f"Compiling {filename}...")
        path = os.path.join(source_dir, filename)
        ascii_string = compile_image_to_ascii(path)
        gallery.append({
            "id": filename,
            "name": filename.upper(),
            "ascii": ascii_string
        })
        
    with open(output_file, 'w') as f:
        json.dump(gallery, f)

if __name__ == "__main__":
    process_gallery('public/gallery', 'src/gallery_compiled.json')
