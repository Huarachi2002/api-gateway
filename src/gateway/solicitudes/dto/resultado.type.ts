import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Resultado {
  @Field()
  resultado_id: number;

  @Field()
  solicitud_id: string;

  @Field()
  url_pdf_resultado: string;

  @Field()
  fecha_publicacion: Date;
}
