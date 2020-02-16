import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelit'
})
export class AgentStatusPipe implements PipeTransform {

  transform(status: string): string {
    return (status === 'A') ? 'Available' : 'Not Available';
  }

}
