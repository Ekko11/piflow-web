package cn.cnic.component.mxGraph.domain;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.cnic.base.utils.UUIDUtils;
import cn.cnic.component.mxGraph.entity.MxCell;
import cn.cnic.component.mxGraph.entity.MxGeometry;
import cn.cnic.component.mxGraph.entity.MxGraphModel;
import cn.cnic.component.mxGraph.mapper.MxCellMapper;
import cn.cnic.component.mxGraph.mapper.MxGeometryMapper;
import cn.cnic.component.mxGraph.mapper.MxGraphModelMapper;

@Component
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, timeout = 36000, rollbackFor = Exception.class)
public class MxGraphModelDomain {

    @Autowired
    private MxGraphModelMapper mxGraphModelMapper;

    @Autowired
    private MxCellMapper mxCellMapper;

    @Autowired
    private MxGeometryMapper mxGeometryMapper;

    public int saveOrUpdate(MxGraphModel mxGraphModel) throws Exception {
        if (null == mxGraphModel) {
            throw new Exception("save failed");
        }
        if (StringUtils.isBlank(mxGraphModel.getId())) {
            return addMxGraphModel(mxGraphModel);
        } else {
            return updateMxGraphModel(mxGraphModel);
        }
    }

    /**
     * Add process of things
     *
     * @param mxGraphModel mxGraphModel
     * @return affected rows
     */
    public int addMxGraphModel(MxGraphModel mxGraphModel) throws Exception {
        if (null == mxGraphModel) {
            throw new Exception("save failed");
        }
        String id = mxGraphModel.getId();
        if (StringUtils.isBlank(id)) {
            mxGraphModel.setId(UUIDUtils.getUUID32());
        }
        int affectedRows = mxGraphModelMapper.addMxGraphModel(mxGraphModel);
        if (affectedRows <= 0) {
            throw new Exception("save failed");
        }
        // save MxCell
        List<MxCell> mxCellList = mxGraphModel.getRoot();
        if (null != mxCellList && mxCellList.size() > 0) {
            for (MxCell mxCell : mxCellList) {
                mxCell.setMxGraphModel(mxGraphModel);
                affectedRows = addMxCell(mxCell);
            }
        }
        return affectedRows;
    }

    public int addMxCell(MxCell mxCell) throws Exception {
        if (null == mxCell) {
            throw new Exception("save failed");
        }
        if (StringUtils.isBlank(mxCell.getId())) {
            mxCell.setId(UUIDUtils.getUUID32());
        }
        int affectedRows = mxCellMapper.addMxCell(mxCell);
        if (affectedRows <= 0) {
            throw new Exception("save failed");
        }
        MxGeometry mxGeometry = mxCell.getMxGeometry();
        if (null == mxGeometry) {
            return affectedRows;
        }
        mxGeometry.setMxCell(mxCell);
        int addMxGeometryCount = mxGeometryMapper.addMxGeometry(mxGeometry);
        if (addMxGeometryCount <= 0) {
            throw new Exception("save failed");
        }
        affectedRows += addMxGeometryCount;
        
        return affectedRows;
    }

    public int updateMxGraphModel(MxGraphModel mxGraphModel) throws Exception {
        if (null == mxGraphModel) {
            return 0;
        }
        if (StringUtils.isBlank(mxGraphModel.getId())) {
            return 0;
        }
        int affectedRows = mxGraphModelMapper.updateMxGraphModel(mxGraphModel);
        
        List<MxCell> mxCellList = mxGraphModel.getRoot();
        if (null != mxCellList && mxCellList.size() > 0) {
            for (MxCell mxCell : mxCellList) {
                if (null == mxCell) {
                    continue;
                }
                mxCell.setMxGraphModel(mxGraphModel);
                if (StringUtils.isBlank(mxCell.getId())) {
                    affectedRows += addMxCell(mxCell);
                    continue;
                }
                affectedRows += updateMxCell(mxCell);
            }
        }
        
        return affectedRows;
    }

    public int updateMxCell(MxCell mxCell) throws Exception {
        if (null == mxCell) {
            return 0;
        }
        if (StringUtils.isBlank(mxCell.getId())) {
            mxCell.setId(UUIDUtils.getUUID32());
        }
        int addMxCellCount = mxCellMapper.updateMxCell(mxCell);
        MxGeometry mxGeometry = mxCell.getMxGeometry();
        if (null == mxGeometry) {
            return addMxCellCount;
        }
        mxGeometry.setMxCell(mxCell);
        int addMxGeometryCount = updateMxGeometry(mxGeometry);
        return addMxCellCount + addMxGeometryCount;
    }

    public int updateMxGeometry(MxGeometry mxGeometry) {
        if (null == mxGeometry) {
            return 0;
        }
        return mxGeometryMapper.updateMxGeometry(mxGeometry);
    }

    public MxGraphModel getMxGraphModelByFlowId(String flowGroupId) {
        return mxGraphModelMapper.getMxGraphModelByFlowId(flowGroupId);
    }

    public MxGraphModel getMxGraphModelByFlowGroupId(String flowGroupId) {
        return mxGraphModelMapper.getMxGraphModelByFlowGroupId(flowGroupId);
    }

}
