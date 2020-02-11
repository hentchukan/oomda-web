import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelit'
})
export class AgentStatusPipe implements PipeTransform {

  transform(status: string): string {
    return (status === 'AVAILABLE') ? 'Available' : 'Not Available';
  }

}
