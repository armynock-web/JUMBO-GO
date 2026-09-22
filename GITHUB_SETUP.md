# คำแนะนำการสร้างโปรเจกต์ GitHub "JUMBO GO"

## ⚠️ คำเตือนด้านความปลอดภัย
**อย่าแชร์ Git token หรือ secrets ในข้อความ** ใช้วิธีที่ปลอดภัยต่อไปนี้แทน

## วิธีที่ 1: ใช้ GitHub CLI (แนะนำ)

### 1. ติดตั้ง GitHub CLI
- **Windows:** ดาวน์โหลดจาก https://cli.github.com/
- **หรือใช้:** `winget install --id GitHub.cli`

### 2. ล็อกอิน GitHub
```bash
gh auth login
```
- เลือก "GitHub.com"
- เลือก "HTTPS"
- เลือก "Login with a web browser"

### 3. สร้าง Repository ใหม่
```bash
gh repo create JUMBO-GO --public --source=. --remote=origin --push
```

## วิธีที่ 2: ใช้ Git และ GitHub Website

### 1. เตรียมโปรเจกต์
```bash
cd C:\Users\armyn\Downloads\JUMBO
git init
git add .
git commit -m "chore: initial commit with project structure and standards

- เพิ่มไฟล์: AGENTS.md, CHANGELOG.md, VERSION.md
- ตั้งค่ามาตรฐานการทำงานตามเอกสาร AGENTS.md

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"
```

### 2. สร้าง Repository บน GitHub
1. ไปที่ https://github.com/new
2. ตั้งชื่อ repository: `JUMBO-GO`
3. เลือก Public หรือ Private
4. อย่าเลือก "Initialize this repository"
5. กด "Create repository"

### 3. เชื่อมต่อและ Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/JUMBO-GO.git
git branch -M main
git push -u origin main
```

## วิธีที่ 3: ใช้ Git Credential Manager (Windows)

### 1. ตั้งค่า Git Credentials
```bash
git config --global credential.helper manager-core
```

### 2. ดำเนินการตามวิธีที่ 2
เมื่อถึงขั้นตอน `git push` จะมีหน้าต่าง pop-up ให้ล็อกอิน GitHub

## การจัดการ Secrets อย่างปลอดภัย

### ใช้ skill upload-secrets ของ Devin
```bash
# สร้างไฟล์ .env ในโปรเจกต์
# ใส่ secrets ในไฟล์นี้

# อัปโหลด secrets ไปยัง Devin Cloud
c:\Users\armyn\AppData\Local\Programs\Devin\resources\app\extensions\windsurf\devin\bin\devin.exe cloud drs secret-create --from-dotenv .env
```

### หรือใช้ GitHub Secrets
1. ไปที่ Settings > Secrets and variables > Actions
2. กด "New repository secret"
3. เพิ่ม secrets ที่จำเป็น

## การตั้งค่า Git ตามมาตรฐาน

### ตั้งค่า User Information
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### ตั้งค่า Branch Protection
1. ไปที่ Settings > Branches
2. เพิ่ม rule สำหรับ `main` branch:
   - Require pull request before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## การสร้าง Feature Branch
```bash
git checkout -b feature/your-feature-name
# ทำงาน...
git add .
git commit -m "feat: คำอธิบายการเปลี่ยนแปลง"
git push origin feature/your-feature-name
```

## การสร้าง Pull Request
```bash
gh pr create --title "ชื่อ PR" --body "รายละเอียดการเปลี่ยนแปลง"
```

---

**ข้อแนะนำ:** หลังจากสร้าง repository แล้ว ควร:
1. ตั้งค่า branch protection rules
2. เพิ่ม collaborators หากทำงานเป็นทีม
3. ตั้งค่า GitHub Actions สำหรับ CI/CD
4. เพิ่ม project board สำหรับ tracking issues