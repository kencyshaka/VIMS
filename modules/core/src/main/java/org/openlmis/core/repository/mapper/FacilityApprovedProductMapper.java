/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

package org.openlmis.core.repository.mapper;

import org.apache.ibatis.annotations.*;
import org.apache.ibatis.session.RowBounds;
import org.openlmis.core.domain.DosageUnit;
import org.openlmis.core.domain.FacilityTypeApprovedProduct;
import org.openlmis.core.domain.ProductCategory;
import org.openlmis.core.domain.ProductForm;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FacilityApprovedProductMapper maps the FacilityTypeApprovedProduct mapping entity to corresponding representation in database.
 */
@Repository
public interface FacilityApprovedProductMapper {

  @Insert("INSERT INTO facility_approved_products(" +
    "facilityTypeId, programProductId, maxMonthsOfStock, modifiedBy, modifiedDate) values " +
    "(#{facilityType.id}, #{programProduct.id}, #{maxMonthsOfStock}, #{modifiedBy}, #{modifiedDate})")
  @Options(useGeneratedKeys = true)
  Integer insert(FacilityTypeApprovedProduct facilityTypeApprovedProduct);

  @Select({"SELECT fap.*, pp.*, pgm.*, pgm.code as program_code, pgm.name as program_name, pgm.active as program_active, " +
    "p.*, p.code as product_code ",
    "FROM facility_approved_products fap ",
    "INNER JOIN facilities f ON f.typeId = fap.facilityTypeId",
    "INNER JOIN program_products pp ON pp.id = fap.programProductId",
    "INNER JOIN products p ON p.id = pp.productId ",
    "INNER JOIN product_categories pc ON pc.id = pp.productCategoryId ",
    "INNER JOIN programs pgm ON pp.programId = pgm.id ",
    "WHERE",
    "pp.programId = #{programId}",
    "AND f.id = #{facilityId}",
    "AND p.fullSupply = TRUE",
    "AND p.active = TRUE",
    "AND pp.active = TRUE",
    "ORDER BY pc.displayOrder, pc.name, pp.displayOrder NULLS LAST, p.code"})
  @Results(value = {
    @Result(property = "programProduct.id", column = "programProductId"),
    @Result(property = "programProduct.dosesPerMonth", column = "dosesPerMonth"),
    @Result(property = "programProduct.active", column = "active"),
    @Result(property = "programProduct.currentPrice", column = "currentPrice"),
    @Result(property = "programProduct.program.id", column = "programId"),
    @Result(property = "programProduct.program.code", column = "program_code"),
    @Result(property = "programProduct.program.name", column = "program_name"),
    @Result(property = "programProduct.program.description", column = "description"),
    @Result(property = "programProduct.program.active", column = "program_active"),
    @Result(property = "programProduct.program.templateConfigured", column = "templateConfigured"),
    @Result(property = "programProduct.product.id", column = "productId"),
    @Result(property = "programProduct.product.code", column = "product_code"),
    @Result(property = "programProduct.product.primaryName", column = "primaryName"),
    @Result(property = "programProduct.product.strength", column = "strength"),
    @Result(property = "programProduct.product.dosesPerDispensingUnit", column = "dosesPerDispensingUnit"),
    @Result(property = "programProduct.product.packSize", column = "packSize"),
    @Result(property = "programProduct.product.roundToZero", column = "roundToZero"),
    @Result(property = "programProduct.product.packRoundingThreshold", column = "packRoundingThreshold"),
    @Result(property = "programProduct.product.dispensingUnit", column = "dispensingUnit"),
    @Result(property = "programProduct.product.fullSupply", column = "fullSupply"),
    @Result(property = "programProduct.displayOrder", column = "displayOrder"),
    @Result(property = "programProduct.product.form", column = "formId", javaType = ProductForm.class,
      one = @One(select = "org.openlmis.core.repository.mapper.ProductFormMapper.getById")),
    @Result(property = "programProduct.productCategory", column = "productCategoryId", javaType = ProductCategory.class,
      one = @One(select = "org.openlmis.core.repository.mapper.ProductCategoryMapper.getProductCategoryById")),
    @Result(property = "programProduct.product.dosageUnit", column = "dosageUnitId", javaType = DosageUnit.class,
      one = @One(select = "org.openlmis.core.repository.mapper.DosageUnitMapper.getById")),
    @Result(property = "facilityType.id", column = "facilityTypeId")})
  List<FacilityTypeApprovedProduct> getFullSupplyProductsByFacilityAndProgram(@Param("facilityId") Long facilityId,
                                                                              @Param("programId") Long programId);

  @Select({"SELECT fap.*, pp.*, pgm.*, pgm.code as program_code, pgm.name as program_name, pgm.active as program_active, " +
    "p.*, p.code as product_code ",
    "FROM facility_approved_products fap ",
    "INNER JOIN facilities f ON f.typeId = fap.facilityTypeId",
    "INNER JOIN program_products pp ON pp.id = fap.programProductId",
    "INNER JOIN products p ON p.id = pp.productId ",
    "INNER JOIN product_categories pc ON pc.id = pp.productCategoryId ",
    "INNER JOIN programs pgm ON pp.programId = pgm.id ",
    "WHERE",
    "pp.programId = #{programId}",
    "AND f.id = #{facilityId}",
    "AND p.fullSupply = FALSE",
    "AND p.active = TRUE",
    "AND pp.active = TRUE",
    "ORDER BY pc.displayOrder, pc.name, pp.displayOrder NULLS LAST, p.code"})
  @Results(value = {
    @Result(property = "programProduct.id", column = "programProductId"),
    @Result(property = "programProduct.dosesPerMonth", column = "dosesPerMonth"),
    @Result(property = "programProduct.active", column = "active"),
    @Result(property = "programProduct.currentPrice", column = "currentPrice"),
    @Result(property = "programProduct.program.id", column = "programId"),
    @Result(property = "programProduct.program.code", column = "program_code"),
    @Result(property = "programProduct.program.name", column = "program_name"),
    @Result(property = "programProduct.program.description", column = "description"),
    @Result(property = "programProduct.program.active", column = "program_active"),
    @Result(property = "programProduct.program.templateConfigured", column = "templateConfigured"),
    @Result(property = "programProduct.product.id", column = "productId"),
    @Result(property = "programProduct.product.code", column = "product_code"),
    @Result(property = "programProduct.product.primaryName", column = "primaryName"),
    @Result(property = "programProduct.product.strength", column = "strength"),
    @Result(property = "programProduct.product.dosesPerDispensingUnit", column = "dosesPerDispensingUnit"),
    @Result(property = "programProduct.product.packSize", column = "packSize"),
    @Result(property = "programProduct.product.roundToZero", column = "roundToZero"),
    @Result(property = "programProduct.product.packRoundingThreshold", column = "packRoundingThreshold"),
    @Result(property = "programProduct.product.dispensingUnit", column = "dispensingUnit"),
    @Result(property = "programProduct.product.fullSupply", column = "fullSupply"),
    @Result(property = "programProduct.displayOrder", column = "displayOrder"),
    @Result(property = "programProduct.product.form", column = "formId", javaType = ProductForm.class,
      one = @One(select = "org.openlmis.core.repository.mapper.ProductFormMapper.getById")),
    @Result(property = "programProduct.productCategory", column = "productCategoryId", javaType = ProductCategory.class,
      one = @One(select = "org.openlmis.core.repository.mapper.ProductCategoryMapper.getProductCategoryById")),
    @Result(property = "programProduct.product.dosageUnit", column = "dosageUnitId", javaType = DosageUnit.class,
      one = @One(select = "org.openlmis.core.repository.mapper.DosageUnitMapper.getById")),
    @Result(property = "facilityType.id", column = "facilityTypeId")})
  List<FacilityTypeApprovedProduct> getNonFullSupplyProductsByFacilityAndProgram(@Param("facilityId") Long facilityId,
                                                                                 @Param("programId") Long programId);

  @Select({"SELECT fap.id, fap.facilityTypeId, fap.programProductId, fap.maxMonthsOfStock, fap.modifiedDate, fap.modifiedBy",
    "FROM facility_approved_products fap, facility_types ft",
    "where fap.programProductId = #{programProductId} and",
    "ft.code = #{facilityTypeCode} and ft.id = fap.facilityTypeId"})
  FacilityTypeApprovedProduct getFacilityApprovedProductIdByProgramProductAndFacilityTypeCode(@Param("programProductId") Long programProductId,
                                                                                              @Param("facilityTypeCode") String facilityTypeCode);

  @Update("UPDATE facility_approved_products set " +
    "facilityTypeId=#{facilityType.id}, programProductId=#{programProduct.id}, maxMonthsOfStock=#{maxMonthsOfStock}, modifiedBy=#{modifiedBy}, modifiedDate=#{modifiedDate} " +
    "where id=#{id}")
  void updateFacilityApprovedProduct(FacilityTypeApprovedProduct facilityTypeApprovedProduct);

  @Select({"SELECT fap.*, pp.active AS active, prod.active AS globalActive, prod.id AS productId, prod.code AS productCode, prod.primaryName AS productName,",
    "prod.fullSupply AS fullSupply, prod.strength as strength, prod.dosageUnitId as dosageUnitId, pc.id AS categoryId, pc.name AS categoryName FROM facility_approved_products fap",
    "INNER JOIN program_products pp ON pp.id = fap.programProductId",
    "INNER JOIN products prod ON prod.id = pp.productId",
    "INNER JOIN product_categories pc ON pc.id = pp.productCategoryId",
    "WHERE fap.facilityTypeId = #{facilityTypeId} AND pp.programId = #{programId} AND",
    "(LOWER(prod.code) LIKE '%' || LOWER(#{searchParam}) || '%' OR LOWER(prod.primaryName) LIKE '%' || LOWER(#{searchParam}) || '%')",
    "ORDER BY LOWER(pc.name), LOWER(prod.code), LOWER(prod.primaryName)"})
  @Results(value = {
    @Result(property = "programProduct.id", column = "programProductId"),
    @Result(property = "programProduct.active", column = "active"),
    @Result(property = "programProduct.product.id", column = "productId"),
    @Result(property = "programProduct.product.code", column = "productCode"),
    @Result(property = "programProduct.product.primaryName", column = "productName"),
    @Result(property = "programProduct.product.fullSupply", column = "fullSupply"),
    @Result(property = "programProduct.product.active", column = "globalActive"),
    @Result(property = "programProduct.product.strength", column = "strength"),
    @Result(property = "programProduct.product.dosageUnit", column = "dosageUnitId", javaType = DosageUnit.class,
      one = @One(select = "org.openlmis.core.repository.mapper.DosageUnitMapper.getById")),
    @Result(property = "programProduct.productCategory.id", column = "categoryId"),
    @Result(property = "programProduct.productCategory.name", column = "categoryName")
  })
  List<FacilityTypeApprovedProduct> getAllBy(@Param(value = "facilityTypeId") Long facilityTypeId,
                                             @Param(value = "programId") Long programId,
                                             @Param(value = "searchParam") String searchParam, RowBounds rowBounds);

  @Select({"SELECT COUNT(*) FROM facility_approved_products fap",
    "INNER JOIN program_products pp ON pp.id = fap.programProductId",
    "INNER JOIN products prod ON prod.id = pp.productId",
    "INNER JOIN product_categories pc ON pc.id = pp.productCategoryId",
    "WHERE fap.facilityTypeId = #{facilityTypeId} AND pp.programId = #{programId} AND",
    "(LOWER(prod.code) LIKE '%' || LOWER(#{searchParam}) || '%' OR LOWER(prod.primaryName) LIKE '%' || LOWER(#{searchParam}) || '%')"})
  Integer getTotalSearchResultCount(@Param(value = "facilityTypeId") Long facilityTypeId,
                                    @Param(value = "programId") Long programId,
                                    @Param(value = "searchParam") String searchParam);
}
