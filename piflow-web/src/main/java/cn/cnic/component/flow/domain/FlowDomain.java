package cn.cnic.component.flow.domain;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.cnic.base.utils.UUIDUtils;
import cn.cnic.component.flow.entity.Flow;
import cn.cnic.component.flow.entity.Paths;
import cn.cnic.component.flow.entity.Stops;
import cn.cnic.component.flow.mapper.FlowMapper;
import cn.cnic.component.flow.mapper.PathsMapper;
import cn.cnic.component.flow.vo.FlowVo;
import cn.cnic.component.mxGraph.domain.MxGraphModelDomain;
import cn.cnic.component.mxGraph.entity.MxGraphModel;

@Component
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, timeout = 36000, rollbackFor = Exception.class)
public class FlowDomain extends StopsDomain{

    @Autowired
    private FlowMapper flowMapper;

    @Autowired
    private PathsMapper pathsMapper;

    @Autowired
    private MxGraphModelDomain mxGraphModelDomain;

    public int saveOrUpdate(Flow flow, String[] globalParamsIds) throws Exception {
        if (null == flow) {
            throw new Exception("save failed, flow is null");
        }
        if (StringUtils.isBlank(flow.getId())) {
            return addFlow(flow);
        }
        return updateFlow(flow);
    }

    public int addFlow(Flow flow) throws Exception {
        if (null == flow) {
            throw new Exception("save failed");
        }
        String id = flow.getId();
        if (StringUtils.isBlank(id)) {
            flow.setId(UUIDUtils.getUUID32());
        }
        int affectedRows = flowMapper.addFlow(flow);
        if (affectedRows <= 0) {
            throw new Exception("save failed");
        }

        List<Stops> stopsList = flow.getStopsList();
        if (null != stopsList && stopsList.size() > 0) {
            for (Stops stops : stopsList) {
                if (null == stops) {
                    continue;
                }
                stops.setFlow(flow);
                affectedRows += addStops(stops);
            }
        }

        List<Paths> pathsList = flow.getPathsList();
        if (null != pathsList && pathsList.size() > 0) {
            for (Paths paths : pathsList) {
                if (null == paths) {
                    continue;
                }
                paths.setFlow(flow);
                ;
                affectedRows += addPaths(paths);
            }
        }

        MxGraphModel mxGraphModel = flow.getMxGraphModel();
        if (null != mxGraphModel) {
            mxGraphModel.setFlow(flow);
            affectedRows += mxGraphModelDomain.addMxGraphModel(mxGraphModel);
        }
        if (null!=flow.getGlobalParamsIds() && flow.getGlobalParamsIds().length > 0) {
        	affectedRows += linkGlobalParams(flow.getId(),flow.getGlobalParamsIds());
        }
        return affectedRows;
    }

    public int addPaths(Paths paths) throws Exception {
        if (null == paths) {
            throw new Exception("save failed");
        }
        String id = paths.getId();
        if (StringUtils.isBlank(id)) {
            paths.setId(UUIDUtils.getUUID32());
        }
        int affectedRows = pathsMapper.addPaths(paths);
        if (affectedRows <= 0) {
            throw new Exception("save failed");
        }
        return affectedRows;
    }

    public int updateFlow(Flow flow) throws Exception {
        if (null == flow) {
            return 0;
        }
        int affectedRows = flowMapper.updateFlow(flow);
        List<Stops> stopsList = flow.getStopsList();
        if (null != stopsList && stopsList.size() > 0) {
            for (Stops stops : stopsList) {
                if (null == stops) {
                    continue;
                }
                stops.setFlow(flow);
                if (StringUtils.isBlank(stops.getId())) {
                    affectedRows += addStops(stops);
                    continue;
                }
                affectedRows += updateStops(stops);
            }
        }

        List<Paths> pathsList = flow.getPathsList();
        if (null != pathsList && pathsList.size() > 0) {
            for (Paths paths : pathsList) {
                if (null == paths) {
                    continue;
                }
                paths.setFlow(flow);
                if (StringUtils.isBlank(paths.getId())) {
                    affectedRows += addPaths(paths);
                    continue;
                }
                affectedRows += updatePaths(paths);
            }
        }

        MxGraphModel mxGraphModel = flow.getMxGraphModel();
        if (null != mxGraphModel) {
            mxGraphModel.setFlow(flow);
            if (StringUtils.isBlank(mxGraphModel.getId())) {
                affectedRows += mxGraphModelDomain.addMxGraphModel(mxGraphModel);
            } else {
                affectedRows += mxGraphModelDomain.updateMxGraphModel(mxGraphModel);
            }
        }
        String[] globalParamsIdsDB = getGlobalParamsIdsByFlowId(flow.getId());
        if (null!=flow.getGlobalParamsIds() && flow.getGlobalParamsIds().length > 0) {
        	List<String> req = Arrays.asList(flow.getGlobalParamsIds());
        	List<String> db = Arrays.asList(globalParamsIdsDB);
            //1、并集 union
        	//Object[] array = CollectionUtils.union(req, db).toArray();
            //2、交集 intersection
        	//Object[] array = CollectionUtils.intersection(req, db).toArray();
        	//3、交集的补集
        	//Object[] disjunction = CollectionUtils.disjunction(req, db).toArray();
        	//4、差集（扣除）
        	Object[] subtract = CollectionUtils.subtract(db, req).toArray();
            String[] unlinkIds = Arrays.copyOf(subtract, subtract.length, String[].class);
            affectedRows += unlinkGlobalParams(flow.getId(), unlinkIds);
            affectedRows += linkGlobalParams(flow.getId(), flow.getGlobalParamsIds());
        } else {
        	affectedRows += unlinkGlobalParams(flow.getId(), globalParamsIdsDB);
        }
        return affectedRows;
    }

    public int updateFlowNoCascading(Flow flow) {
        if (null == flow) {
            return 0;
        }
        return flowMapper.updateFlow(flow);
    }

    public int updatePaths(Paths paths) {
        if (null == paths) {
            return 0;
        }
        return pathsMapper.updatePaths(paths);
    }

    public Flow getFlowById(String id) {
        return flowMapper.getFlowById(id);
    }

    public List<FlowVo> getFlowListParam(String username, boolean isAdmin, String param) {
        return flowMapper.getFlowListParam(username, isAdmin, param);
    }

    public List<String> getFlowNamesByFlowGroupId(String flowGroupId, String flowName) {
        return flowMapper.getFlowNamesByFlowGroupId(flowGroupId, flowName);
    }

    public String getFlowIdByNameAndFlowGroupId(String fid, String flowName) {
        return flowMapper.getFlowIdByNameAndFlowGroupId(fid, flowName);
    }

    public Flow getFlowByPageId(String fid, String pageId) {
        return flowMapper.getFlowByPageId(fid, pageId);
    }

    public String[] getFlowAndGroupNamesByFlowGroupId(String flowGroupId) {
        return flowMapper.getFlowAndGroupNamesByFlowGroupId(flowGroupId);
    }

    public String getFlowIdByPageId(String fid, String pageId) {
        return flowMapper.getFlowIdByPageId(fid, pageId);
    }

    public Integer getMaxFlowPageIdByFlowGroupId(String flowGroupId) {
        return flowMapper.getMaxFlowPageIdByFlowGroupId(flowGroupId);
    }

    public List<Flow> getFlowList() {
        return flowMapper.getFlowList();
    }

    public List<Flow> getFlowExampleList() {
        return flowMapper.getFlowExampleList();
    }

    public Integer getMaxStopPageId(String flowId) {
        return flowMapper.getMaxStopPageId(flowId);
    }

    public Integer updateEnableFlagById(String username, String flowId) {
        return flowMapper.updateEnableFlagById(username, flowId);
    }

    public String getFlowName(String flowName) {
        return flowMapper.getFlowName(flowName);
    }
    
    public String[] getGlobalParamsIdsByFlowId(String flowId) {
    	return flowMapper.getGlobalParamsIdsByFlowId(flowId);
    }
    
    public int linkGlobalParams(String flowId, String[] globalParamsIds) {
    	return flowMapper.linkGlobalParams(flowId, globalParamsIds);
    }
    
    public int unlinkGlobalParams(String flowId, String[] globalParamsIds) {
    	return flowMapper.unlinkGlobalParams(flowId, globalParamsIds);
    }
    
}
