"""Package MediBuddy v2 into distributable ZIP"""
import zipfile
import os
import json
import hashlib
from pathlib import Path
from datetime import datetime


def create_manifest(root_dir: Path) -> dict:
    """Create manifest of all files"""
    manifest = {
        "project": "MediBuddy v2",
        "version": "2.0.0",
        "created": datetime.now().isoformat(),
        "files": []
    }
    
    for file_path in root_dir.rglob('*'):
        if file_path.is_file() and not any(part.startswith('.') for part in file_path.parts):
            rel_path = file_path.relative_to(root_dir)
            manifest["files"].append(str(rel_path))
    
    return manifest


def calculate_sha256(file_path: Path) -> str:
    """Calculate SHA256 hash of a file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def create_zip(source_dir: Path, output_path: Path) -> None:
    """Create ZIP file of the project"""
    print(f"Creating ZIP: {output_path}")
    
    # Create manifest
    manifest = create_manifest(source_dir)
    manifest_path = source_dir / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    # Create ZIP
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in source_dir.rglob('*'):
            if file_path.is_file():
                # Skip hidden files and __pycache__
                if any(part.startswith('.') or part == '__pycache__' for part in file_path.parts):
                    continue
                
                arcname = file_path.relative_to(source_dir.parent)
                zipf.write(file_path, arcname)
                print(f"  Added: {arcname}")
    
    # Calculate ZIP checksum
    zip_hash = calculate_sha256(output_path)
    print(f"\nZIP created successfully!")
    print(f"Location: {output_path.absolute()}")
    print(f"Size: {output_path.stat().st_size / (1024*1024):.2f} MB")
    print(f"SHA256: {zip_hash}")
    
    # Update manifest with ZIP hash
    manifest["zip_sha256"] = zip_hash
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)


if __name__ == "__main__":
    # Paths
    project_root = Path(__file__).parent
    output_dir = Path("/tmp")  # Changed from /output to /tmp for compatibility
    output_dir.mkdir(exist_ok=True)
    output_file = output_dir / "medi_buddy_v2_generated.zip"
    
    # Create ZIP
    create_zip(project_root, output_file)
    
    print("\n" + "="*60)
    print(f"DONE: {output_file.absolute()}")
    print("="*60)
