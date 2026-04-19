import os
import json
import math
from PIL import Image, ImageStat, ImageEnhance

def get_char_for_luminance(l):
    chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
    index = int(((255 - l) / 255) * (len(chars) - 1))
    index = max(0, min(len(chars) - 1, index))
    return chars[index]

def compile_image_to_ascii(image_path, width=160):
    img = Image.open(image_path).convert('RGB')
    font_aspect_ratio = 0.55
    height = int((img.height / img.width) * width * font_aspect_ratio)
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    pixels = img.load()
    raw_luminances = []
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            lum = (0.2126 * r + 0.7152 * g + 0.0722 * b)
            raw_luminances.append(lum)
    min_lum = min(raw_luminances)
    max_lum = max(raw_luminances)
    range_lum = max_lum - min_lum if max_lum - min_lum > 0 else 1
    ascii_rows = []
    for y in range(height):
        row = ""
        for x in range(width):
            lum = raw_luminances[y * width + x]
            normalized = (lum - min_lum) / range_lum
            s = normalized
            if s < 0.5:
                normalized = 2 * s * s
            else:
                normalized = 1 - pow(-2 * s + 2, 2) / 2
            final_lum = normalized * 255
            row += get_char_for_luminance(final_lum)
        ascii_rows.append(row)
    return "\n".join(ascii_rows)

def process_gallery(base_dir, output_file):
    gallery = []
    valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    
    categories = ['public', 'private']
    
    for cat in categories:
        cat_dir = os.path.join(base_dir, cat)
        if not os.path.exists(cat_dir):
            continue
            
        files = sorted([f for f in os.listdir(cat_dir) if f.lower().endswith(valid_extensions)])
        print(f"Processing category: {cat.upper()} ({len(files)} items)")
        
        for filename in files:
            print(f"  -> Archiving {filename}...")
            path = os.path.join(cat_dir, filename)
            try:
                ascii_string = compile_image_to_ascii(path)
                gallery.append({
                    "id": f"{cat}_{filename}",
                    "name": filename.upper(),
                    "ascii": ascii_string,
                    "category": cat.upper()
                })
            except Exception as e:
                print(f"Error processing {filename}: {e}")
        
    with open(output_file, 'w') as f:
        json.dump(gallery, f)
    print(f"Successfully compiled {len(gallery)} images into {output_file}")

if __name__ == "__main__":
    process_gallery('/root/Pictures/pics', '/root/parada-pics/src/gallery_compiled.json')
