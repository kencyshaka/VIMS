/*
 * Electronic Logistics Management Information System (eLMIS) is a supply chain management system for health commodities in a developing country setting.
 *
 * Copyright (C) 2015  John Snow, Inc (JSI). This program was produced for the U.S. Agency for International Development (USAID). It was prepared under the USAID | DELIVER PROJECT, Task Order 4.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * created by Martha Shaka
 * 31/03/2017
 */
package org.openlmis.report.service;

import lombok.NoArgsConstructor;
import org.apache.ibatis.session.RowBounds;
import org.openlmis.core.domain.Facility;
import org.openlmis.core.service.FacilityService;
import org.openlmis.report.mapper.BarcodeActivityReportMapper;
import org.openlmis.report.model.ResultRow;
import org.openlmis.report.model.params.BarcodeActivityReportParam;
import org.openlmis.report.util.StringHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static org.openlmis.core.domain.RightName.MANAGE_EQUIPMENT_INVENTORY;

@Component("barcodeDataProvider")
@NoArgsConstructor
public class BarcodeActivityReportDataProvider extends ReportDataProvider {

  @Autowired
  private FacilityService facilityService;

  @Autowired
  private BarcodeActivityReportMapper barcodeActivityReportMapper;

  private BarcodeActivityReportParam barcodeActivityReportParam  = null;

  @Override
  public List<? extends ResultRow> getReportBody(Map<String, String[]> filterCriteria, Map<String, String[]> sortCriteria, int page, int pageSize) {
    RowBounds rowBounds = new RowBounds((page - 1) * pageSize, pageSize);

    return barcodeActivityReportMapper.SelectBarcodeActivityCountByGeographicalLevel(getReportFilterData(filterCriteria),rowBounds,this.getUserId());
  }


  public BarcodeActivityReportParam getReportFilterData(Map<String, String[]> filterCriteria) {
    if (filterCriteria != null) {
      barcodeActivityReportParam = new BarcodeActivityReportParam();
      barcodeActivityReportParam.setAggregate(StringHelper.isBlank(filterCriteria, "aggregate") ? Boolean.FALSE : Boolean.valueOf(filterCriteria.get("aggregate")[0]));
      Long programId = StringHelper.isBlank(filterCriteria, "program") ? 0L : Long.parseLong(filterCriteria.get("program")[0]);
      barcodeActivityReportParam.setProgramId(programId);
      barcodeActivityReportParam.setFacilityLevel(filterCriteria.get("facilityLevel")[0]);
      String startDate = StringHelper.isBlank(filterCriteria, "startDate") ? null : ((String[]) filterCriteria.get("startDate"))[0];
      barcodeActivityReportParam.setStartDate(startDate);

      String endDate = StringHelper.isBlank(filterCriteria, "endDate") ? null : ((String[]) filterCriteria.get("endDate"))[0];
      barcodeActivityReportParam.setEndDate(endDate);
      // List of facilities includes supervised and home facility
      List<Facility> facilities = facilityService.getUserSupervisedFacilities(this.getUserId(), programId, MANAGE_EQUIPMENT_INVENTORY);
      facilities.add(facilityService.getHomeFacility(this.getUserId()));

      StringBuilder str = new StringBuilder();
      for (Facility f : facilities) {
        str.append(f.getId());
        str.append(",");
      }
      if (str.length() > 1) {
        str.deleteCharAt(str.length()-1);
      }
      barcodeActivityReportParam.setFacilityIds(str.toString());

    }
    return barcodeActivityReportParam;
  }

  @Override
  public String getFilterSummary(Map<String, String[]> params) {
    return getReportFilterData(params).toString();
  }
}
