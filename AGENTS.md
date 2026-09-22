# กฎข้อบังคับและมาตรฐานการทำงานสำหรับการพัฒนาเว็บแอปพลิเคชั่น

## 1. มาตรฐาน Git และแหล่งความจริง (Single Source of Truth)

### 1.1 การ Commit
- **ทุกครั้งที่ทำงานเสร็จ** ต้อง commit โค้ดทันที
- **Commit Message** ต้องเป็นภาษาไทยหรืออังกฤษที่ชัดเจน และต้องระบุ:
  - สิ่งที่เปลี่ยนแปลง (What)
  - เหตุผลที่เปลี่ยนแปลง (Why)
  - ไฟล์ที่ได้รับผลกระทบ (Which files)
- **รูปแบบ Commit Message:**
  ```
  ประเภท: คำอธิบายสั้นๆ

  รายละเอียดเพิ่มเติม (ถ้าจำเป็น)
  
  - แก้ไขไฟล์: file1.ts, file2.ts
  - เพิ่มฟีเจอร์: feature-x
  ```

### 1.2 การใช้ Branch
- **Main Branch** = แหล่งความจริงหลัก (Production Ready)
- **Feature Branch** = สำหรับงานแต่ละอย่าง (feature/ชื่องาน)
- **ทุกงานต้องอยู่ใน branch แยก** ยกเว้นการแก้ bug เล็กๆ
- **ชื่อ Branch:** feature/ชื่องาน-รายละเอียด (เช่น feature/user-authentication)

### 1.3 การ Pull Request และ Code Review
- **ทุก branch ต้องผ่าน Pull Request** ก่อน merge เข้า main
- **ต้องมีการรีวิวโค้ด** อย่างน้อย 1 คน
- **ต้องผ่านการทดสอบอัตโนมัติ** (Automated Tests) ก่อน merge
- **ต้องไม่มี conflict** ก่อน merge

## 2. มาตรฐานการเขียนโค้ด

### 2.1 มาตรฐานโค้ด (Code Standards)
- **ต้องมีการจัดรูปแบบโค้ด** (Formatting) ที่สม่ำเสมอ
- **ต้องมีการตั้งชื่อตัวแปร/ฟังก์ชัน** ที่ชัดเจนและเป็นมาตรฐาน
- **ต้องมีการเขียนคอมเมนต์** สำหรับส่วนที่ซับซ้อน
- **ต้องปฏิบัติตาม Best Practices** ของภาษา/เฟรมเวิร์กที่ใช้

### 2.2 มาตรฐานความปลอดภัย (Security Standards)
- **ต้องไม่มีการเก็บ Secrets/Keys** ในโค้ด (ใช้ Environment Variables)
- **ต้องมีการตรวจสอบ Input** จากผู้ใช้ (Input Validation)
- **ต้องมีการป้องกัน SQL Injection** และ XSS
- **ต้องมีการเข้ารหัส** ข้อมูลที่ละเอียดอ่อน (Encryption)
- **ต้องมีการจัดการ Error** ที่เหมาะสม (Error Handling)

### 2.3 มาตรฐานการทดสอบ (Testing Standards)
- **ต้องมี Unit Tests** สำหรับฟังก์ชันสำคัญ
- **ต้องมี Integration Tests** สำหรับการเชื่อมต่อระบบ
- **ต้องมี E2E Tests** สำหรับ user flow สำคัญ
- **Coverage Rate** ต้องไม่ต่ำกว่า 80%

## 3. มาตรฐานการเอกสาร (Documentation Standards)

### 3.1 เอกสารพิมพ์เขียว (Blueprint Documentation)
- **ต้องมีเอกสารสถาปัตยกรรม** (Architecture Document)
- **ต้องมีเอกสาร API** (API Documentation)
- **ต้องมีเอกสารการติดตั้ง** (Installation Guide)
- **ต้องมีเอกสารการใช้งาน** (User Guide)
- **ต้องอัปเดตเอกสาร** ทุกครั้งที่มีการเปลี่ยนแปลง

### 3.2 เอกสาร Version Control
- **ต้องมี CHANGELOG.md** สำหรับบันทึกการเปลี่ยนแปลง
- **ต้องมี VERSION.md** สำหรับบันทึกเวอร์ชั่น
- **ต้องมีการอัปเดตเอกสาร** ทุกครั้งที่มีการ release

## 4. ขั้นตอนการทำงาน (Workflow)

### 4.1 ขั้นตอนก่อนเริ่มงาน
1. อ่านและทำความเข้าใจเอกสารพิมพ์เขียว (Blueprint)
2. สร้าง branch ใหม่สำหรับงานนั้น
3. อัปเดต todo list สำหรับงานนั้น

### 4.2 ขั้นตอนระหว่างทำงาน
1. เขียนโค้ดตามมาตรฐานที่กำหนด
2. เขียน tests ควบคู่กับโค้ด
3. commit ทุกครั้งที่ทำงานเสร็จในแต่ละส่วน
4. อัปเดต todo list สม่ำเสมอ

### 4.3 ขั้นตอนหลังทำงานเสร็จ
1. รัน tests ทั้งหมดและตรวจสอบว่าผ่าน
2. อัปเดตเอกสารที่เกี่ยวข้อง
3. สร้าง Pull Request
4. รอการรีวิวและ merge
5. อัปเดต CHANGELOG.md และ VERSION.md

## 5. มาตรฐานการสื่อสารกับ AI

### 5.1 คำสั่งพื้นฐาน
- **สำหรับการ commit:** "ช่วยรวบรวมโค้ดทั้งหมดพร้อมผลทดสอบ แล้วสรุป commit message ให้ฉัน จากนั้นบอกคำสั่ง git ที่ใช้ commit และ push ไปยัง repository"
- **สำหรับการสร้าง blueprint:** "ช่วยสร้างเอกสารพิมพ์เขียวของโปรเจ็กต์ปัจจุบัน รวมถึงสถาปัตยกรรม และ commit ไฟล์เอกสารนี้"
- **สำหรับการทดสอบ:** "ช่วยรัน tests ทั้งหมด และรายงานผลการทดสอบ พร้อมแก้ไขปัญหาที่พบ"

### 5.2 คำสั่งเฉพาะเจาะจง
- **สำหรับงานเฉพาะ:** "ช่วย[งานที่ต้องการ] ใน branch [ชื่อ branch] พร้อมอัปเดตเอกสารที่เกี่ยวข้อง"
- **สำหรับการแก้ bug:** "ช่วยตรวจสอบและแก้ไข [ปัญหา] พร้อมเขียน tests สำหรับการแก้ไขนี้"

## 6. มาตรฐานการสร้างไฟล์สรุป

### 6.1 การสร้างไฟล์ ZIP/TAR
- **เมื่อเสร็จงาน:** สร้างไฟล์ ZIP หรือ TAR ที่รวม:
  - Source code ทั้งหมด
  - เอกสารทั้งหมด (Documentation)
  - ผลการทดสอบ (Test Results)
  - เอกสารพิมพ์เขียว (Blueprint)

### 6.2 การสร้างคำสั่ง Git
- **สร้างคำสั่ง git add, git commit, git push** ที่พร้อมใช้งาน
- **ตัวอย่าง:**
  ```bash
  git add .
  git commit -m "feat: เพิ่มฟีเจอร์ authentication system

  - เพิ่มไฟล์: auth/login.ts, auth/register.ts
  - แก้ไขไฟล์: config/database.ts
  - เพิ่ม tests: auth/login.test.ts
  
  Generated with [Devin](https://devin.ai)
  
  Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"
  git push origin feature/authentication
  ```

## 7. หลักวิศวกรรมซอฟต์แวร์ (Software Engineering Principles)

### 7.1 SOLID Principles
- **Single Responsibility:** แต่ละ class/module ต้องมีความรับผิดชอบเดียว
- **Open/Closed:** เปิดสำหรับการขยาย ปิดสำหรับการแก้ไข
- **Liskov Substitution:** subclass ต้องสามารถแทนที่ superclass ได้
- **Interface Segregation:** แยก interface ให้เล็กและเฉพาะเจาะจง
- **Dependency Inversion:** พึ่งพา abstraction ไม่ใช่ concrete implementation

### 7.2 DRY Principle (Don't Repeat Yourself)
- **หลีกเลี่ยงการเขียนโค้ดซ้ำ**
- **สร้าง reusable functions/components**
- **ใช้ inheritance/composition อย่างเหมาะสม**

### 7.3 KISS Principle (Keep It Simple, Stupid)
- **เขียนโค้ดให้เรียบง่ายและเข้าใจง่าย**
- **หลีกเลี่ยงความซับซ้อนที่ไม่จำเป็น**
- **ตั้งชื่อตัวแปร/ฟังก์ชันให้ชัดเจน**

## 8. การตรวจสอบคุณภาพ (Quality Assurance)

### 8.1 Code Review Checklist
- [ ] โค้ดเป็นไปตามมาตรฐานที่กำหนด
- [ ] มี tests ครบถ้วน
- [ ] ผ่านการทดสอบทั้งหมด
- [ ] ไม่มี security vulnerabilities
- [ ] เอกสารถูกอัปเดต
- [ ] Commit message ชัดเจน

### 8.2 Pre-commit Checklist
- [ ] โค้ดผ่าน linting
- [ ] โค้ดผ่าน formatting
- [ ] Tests ผ่านทั้งหมด
- [ ] ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี commented code

---

**หมายเหตุ:** เอกสารนี้จะถูกอัปเดตตามความจำเป็น และทุกครั้งที่มีการอัปเดตจะต้อง commit พร้อมระบุสิ่งที่เปลี่ยนแปลง