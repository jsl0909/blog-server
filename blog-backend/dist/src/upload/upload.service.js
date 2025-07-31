"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let UploadService = class UploadService {
    uploadFile(file) {
        return {
            url: `/uploads/${file.filename}`,
            originalname: file.originalname,
            size: file.size,
        };
    }
    async processMarkdownFile(file) {
        try {
            const filePath = path.join('./uploads', file.filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsedContent = this.parseMarkdownContent(content, file.originalname);
            return {
                success: true,
                data: {
                    originalname: file.originalname,
                    filename: file.filename,
                    size: file.size,
                    ...parsedContent
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    parseMarkdownContent(content, originalname) {
        const lines = content.split('\n');
        let title = '';
        let summary = '';
        let bodyContent = '';
        let inFrontMatter = false;
        let frontMatter = {};
        if (lines[0]?.trim() === '---') {
            inFrontMatter = true;
            let frontMatterLines = [];
            let i = 1;
            while (i < lines.length && lines[i]?.trim() !== '---') {
                frontMatterLines.push(lines[i]);
                i++;
            }
            if (i < lines.length) {
                frontMatter = this.parseYamlFrontMatter(frontMatterLines.join('\n'));
                lines.splice(0, i + 1);
            }
        }
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('# ')) {
                title = line.substring(2).trim();
                lines.splice(i, 1);
                break;
            }
        }
        if (!title) {
            title = path.basename(originalname, '.md');
        }
        let summaryLines = [];
        for (let i = 0; i < Math.min(lines.length, 5); i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#')) {
                summaryLines.push(line);
                if (summaryLines.length >= 3)
                    break;
            }
        }
        summary = summaryLines.join(' ').substring(0, 200);
        bodyContent = lines.join('\n').trim();
        return {
            title: frontMatter['title'] || title,
            summary: frontMatter['summary'] || summary,
            content: bodyContent,
            tags: Array.isArray(frontMatter['tags']) ? frontMatter['tags'] : [],
            category: frontMatter['category'] || null,
            status: frontMatter['status'] || 'DRAFT',
            coverImage: frontMatter['coverImage'] || null,
            publishedAt: frontMatter['publishedAt'] ? new Date(frontMatter['publishedAt']) : null
        };
    }
    parseYamlFrontMatter(yamlContent) {
        const result = {};
        const lines = yamlContent.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const colonIndex = trimmedLine.indexOf(':');
                if (colonIndex > 0) {
                    const key = trimmedLine.substring(0, colonIndex).trim();
                    let value = trimmedLine.substring(colonIndex + 1).trim();
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length - 1);
                    }
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.substring(1, value.length - 1)
                            .split(',')
                            .map(item => item.trim().replace(/['"]/g, ''))
                            .filter(item => item);
                    }
                    result[key] = value;
                }
            }
        }
        return result;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map