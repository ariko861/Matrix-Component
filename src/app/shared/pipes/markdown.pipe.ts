import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { sanitize } from 'dompurify';


@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: any): any {
    if ( value && value.length > 0 ){
      return sanitize(marked.parse(value));
    }
    return value;
  }

}
