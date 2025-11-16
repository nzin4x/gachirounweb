/**
 * Strapi 데이터 경로 헬퍼
 * Strapi API에서 반환된 _strapiPath 메타데이터를 HTML 속성으로 자동 변환
 */

/**
 * Strapi 데이터 객체에서 data-strapi-path 속성 객체를 생성
 * @param data - Strapi API에서 반환된 데이터 (자동 경로 태깅 포함)
 * @returns HTML 속성 객체
 * 
 * @example
 * ```astro
 * const greeting = await strapiClient.getGreeting(env);
 * <div {...strapiAttrs(greeting)}>
 *   <h3 {...strapiFieldAttrs(greeting, 'title')}>{greeting.title}</h3>
 * </div>
 * ```
 */
export function strapiAttrs(data: any) {
  if (!data || !data._strapiPath) {
    return {};
  }
  return {
    'data-strapi-path': data._strapiPath
  };
}

/**
 * Strapi 데이터의 특정 필드에 대한 data-strapi-path 속성 생성
 * @param data - Strapi API에서 반환된 데이터
 * @param fieldName - 필드명
 * @returns HTML 속성 객체
 */
export function strapiFieldAttrs(data: any, fieldName: string) {
  if (!data || !data._strapiFields || !data._strapiFields[fieldName]) {
    return {};
  }
  return {
    'data-strapi-path': data._strapiFields[fieldName]
  };
}

/**
 * Collection 아이템의 경로 속성 생성
 * @param item - Collection의 개별 항목
 * @returns HTML 속성 객체
 */
export function strapiItemAttrs(item: any) {
  return strapiAttrs(item);
}
