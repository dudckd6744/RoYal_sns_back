import { BadRequestException, PipeTransform } from '@nestjs/common';

import { BoardStatus } from '../utils/board.status.enum';

export class BoardStatusPipe implements PipeTransform {
    readonly StatusOption = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

    transform(value: any) {
        if (!value) {
            return new BadRequestException('게시글 상태값을 선택해주세요');
        }
        value = value.toUpperCase();

        if (!this.isStatusOption(value)) {
            return new BadRequestException(
                `${value}는 게시글 상태값에 해당되지않습니다.`,
            );
        }
        return value;
    }
    private isStatusOption(status: any) {
        const index = this.StatusOption.indexOf(status);
        return index != -1;
    }
}
