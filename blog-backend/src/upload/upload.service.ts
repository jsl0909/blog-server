import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
      originalname: file.originalname,
      size: file.size,
    };
  }

  // 处理Markdown文件上传
  async processMarkdownFile(file: Express.Multer.File) {
    try {
      // 读取文件内容
      const filePath = path.join('./uploads', file.filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 解析Markdown内容
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
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 解析Markdown内容，提取标题、摘要等信息
  private parseMarkdownContent(content: string, originalname: string) {
    const lines = content.split('\n');
    let title = '';
    let summary = '';
    let bodyContent = '';
    let inFrontMatter = false;
    let frontMatter = {};
    
    // 检查是否有YAML front matter
    if (lines[0]?.trim() === '---') {
      inFrontMatter = true;
      let frontMatterLines = [];
      let i = 1;
      
      while (i < lines.length && lines[i]?.trim() !== '---') {
        frontMatterLines.push(lines[i]);
        i++;
      }
      
      if (i < lines.length) {
        // 解析front matter
        frontMatter = this.parseYamlFrontMatter(frontMatterLines.join('\n'));
        lines.splice(0, i + 1); // 移除front matter部分
      }
    }
    
    // 提取标题（第一个#开头的行）
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('# ')) {
        title = line.substring(2).trim();
        lines.splice(i, 1); // 移除标题行
        break;
      }
    }
    
    // 如果没有找到标题，使用文件名作为标题
    if (!title) {
      title = path.basename(originalname, '.md');
    }
    
    // 提取摘要（前几行非空内容）
    let summaryLines = [];
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#')) {
        summaryLines.push(line);
        if (summaryLines.length >= 3) break;
      }
    }
    summary = summaryLines.join(' ').substring(0, 200);
    
    // 剩余内容作为正文
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

  // 简单的YAML front matter解析
  private parseYamlFrontMatter(yamlContent: string) {
    const result: any = {};
    const lines = yamlContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmedLine.substring(0, colonIndex).trim();
          let value: any = trimmedLine.substring(colonIndex + 1).trim();
          
          // 移除引号
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
          }
          
          // 处理数组
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
} 